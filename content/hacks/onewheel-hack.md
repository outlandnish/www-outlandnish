---
title: "Helping Make Onewheels More Serviceable (And Getting Punished For It)"
description: What happens when skate and hacker cultures intersect and go up against Silicon Valley techbros?
date: 2023-11-26
external: false
draft: true
---

## Background

In the past two years, I've gotten really invested into the Onewheels. It's such a cool clash of counter cultures - robotics and DIY electronics nerds meet the laid back and expressive worlds of skate and snowboard culture. It's the perfect match for me. And seemingly cool, there's a company (Future Motion) that makes a solution that works out of the box. Sounds perfect for adventure, right?

But there's a really big elephant in the room: what happens when all the tech wizardry or even simple mechanical parts of the board goes wrong?  How do you service or repair an investment that usually is upwards of $1000? Despite that these are robotics platforms that are used in harsh conditions by skaters who love to push the limits of their board, there's no official parts for purchase, no official repair network, no support for fixing your board. Your only option: send your board into Future Motion on your dime for them to diagnose it and hope that it's covered under warranty.

Bad news: they've only got one location for repair. That means that even if you live on the other side of the world, you have to ship your board to Santa Cruz, CA - which is expensive because the lithium batteries means you can't send them via air. That doesn't work for so many people and naturally, they got curious: could they service the board themselves? It turns out, yes, you absolutely can. A DIY movement was born: and out of it, an entire 3rd party repair network where people would sell parts, install new tires, and innovate on the original product.

But even that's been stifled by Future Motion. They started to introduce limitations in the firmware. Someone who wanted to see their battery health could no longer view cell voltages in the app. Suddenly, you could no longer swap out a controller or battery management system because they were paired together (thanks Apple for that BS). A mountain of e-waste was starting to accumulate - the used market was awash with inflated prices for parts on the second hand market that weren't paired.

What if we could just re-use the existing hardware and re-pair them using the methods the factory did?

## Reverse Engineering

Initially, the idea was that if we could patch the firmware to ignore the BMS ID (like third party devices like the JW FFM chip allowed before it was), we could get around the pairing problem altogether. At first, I looked into using the OTA updates that Future Motion provided. Unfortunately, they were all encrypted so it was a useless attempt. That meant dumping the firmware of the STM32F103 that was on my Pint and is also used in the XR platform.

Unfortunately, Future Motion had thought of this scenario and enabled a read out protection feature on the STM32F103 to restrict people from being able to do this very thing. It seemed like a showstopper. However, some intrepid security researchers - Johannes Obermaier, Marc Schink, and Kosma Moczek - had found that there were [some flaws in the read out protection implementation on the STM32F103](https://www.usenix.org/system/files/woot20-paper-obermaier.pdf) that would allow us to bypass it and read the firmware. At first, when I tried it, I had no success. I was disheartened again. What do we do now?

Another member in the community had read the exact same research paper and went a step further. He pulled the chip off of the controller PCB. This was because the BOOT1 GPIO pin that enabled the exploit was grounded on the PCB, which stopped someone from executing code from SRAM. Lo and behold, the exploit worked! He shared the result of this with the community which immediately renewed my interest in the project. Here's the result of doing it at a friend's repair shop:

[] insert video here.

Finally! We had firmware. After setting it up in Ghidra, we got into the process of reverse engineering the firmware. For the most part, this was an entirely new and foreign world to me. Thankfully, the community member who did the original exploit pointed me in the correct direction. He had found that Future Motion had left a magic, catch all ID for BMS' in the firmware. Once I found that (and saw the corresponding error for an invalid BMS), things started to click into place. Based on that, I tried modifying the firmware to patch out the BMS pairing check. Here's the result:

[] insert video here

Since other people in the community had figured out the BLE services the Onewheel exposed for the mobile app, I used that as the basis for figuring out the rest of the firmware. Before long, I had figured out how the board changed ride modes, managed the lights, controlled it's ride settings, and even how it did OTA updates. Since Future Motion had just used the same firmware with different compile time flags between the boards, I was even able to change the behavior of my cheap Pint to behave like the much more expensive XR.

It was cool - we finally had a way to control the firmware - but how can we give everyone the ability to modify their board without having to go through such a long and arduous process of desoldering their chip and writing custom patches?

## Enter Rewheel

It came in two parts. One method, factory mode, used existing functionality built into the boards. The other involved building a CLI and web tool so people could patch their own boards.

### Factory Mode

One, I found that Future Motion had hidden a factory mode into their Bluetooth code. This allowed them to re-pair a new BMS to a controller, presumably when a board was sent in for service as well as re-calibrate the level angle for the board. Most importantly, this function didn't have any special security - as long as you had a Bluetooth connection to the board, you could run the command. I released a video demonstrating this on my Pint:

[ ] insert video here

Needless to say, it started exciting the community. People had been building custom rails for the board that changed the profile of the board to improve the center of gravity. However, they had to manually shim the controller because there wasn't a way to recalibrate the board for what level looked like.

[ ] insert picture of TFL WTF rails

As well, with the new Onewheel GT, Future Motion had gotten even more restrictive. If you unplugged the battery, the board complained about corrupt memory and would not allow you to ride the board. Several members of the community fundraised and sent me money to buy a Onewheel GT to try the factory mode commands on it after a battery replacement.

[ ]

Magically, it worked! Suddenly we had a way to replace batteries on aging boards (like cirrus' who had done x miles on it) and even use aftermarket batteries. We had a way in! The market started to flood with aftermarket rails and battery options for the GT platform as well as the XR and Pint.

### Rewheel

I wanted to build a tool to enable some of the advanced funcitonality of the board, including permanently removing the ID check for BMSs. Before factory mode was discovered, the idea was to build a CLI that approved third party repair facilities could use to do fixes for BMSs' manually by patching out the ID check. They would dump the firmware for each board (which is legally allowed under DMCA law as an archive copy) and hand it back to the user. In order to avoid infringing on Future Motion IP, I built a framework that would calculate a checksum of the dumped firmware and use known offsets in the firmware to apply new code that I had written by hand as patches to the firmware to enable specific functionality. 

[ ] insert photo of CLI tool for Rewheel

I tested it with my local shop but there was an ask for an even easier way. I decided to re-architect the tool for the web. It became a Vite / React web app that was hosted as a static site on Netlify. As usual with my projects, there are no user analytics / data collection (which ended up being important down the road).

[ ] insert photo of first iteration of Rewheel

Around the time of factory mode, I also shared images of this tool to the Onewheel community and people got pretty excited - even though they knew it was limited legally by pulling the chip off of the board. But another rad member of the community reached out and started building patches with me. As we collaborated, we discovered that Future Motion had used symmetric encryption to encrypt their firmware updates. Could we write some custom firmware to legally decrypt Future Motion's OTA updates, patch them, and then allow people to flash them to the board?

It was a huge undertaking, but we figured it out:

1. We built a piece of firmware that was flashed to Onewheel's that dumped the entirety of the bootloader from the device. Because Future Motion had oddly used symmetric encryption and stored the keys in the bootloader, we could provide a user with a legal copy of the encryption keys to their board (again, by dumping an archive copy according to DMCA law)
2. We updated the web tool to decrypt OTA updates so you could patch them the same way you could do for full flash dumps using offsets to the relevant code.
3. Finally, we let the user re-encrypt the update and flash it by reverse engineering Future Motion's OTA process and implementing it with Web Bluetooth.

After a couple of false starts, we started testing it with the public and it was a huge success. Suddenly, people could control their board to a degree Future Motion had never provided with just a couple clicks. We started adding more explicit checks into the user experience to protect users from accidentally flashing the wrong code (or dangerous modifications) to their board. This is what it looked like:

The tool started to get big in the community. Though we had no idea how many users were using it, the amount of chatter and the number of languages it had been translated into indicated a broad, international audience (who stood to benefit the most from avoiding an expensive shipping bill to Future Motion). 

## Shutdown / Lasting Effects

Knowing how litigious Future Motion is, it was a matter of time before they started to find ways to shut it down. In March, they started to hide their old OTA updates so people couldn't download them directly. In April, just as we had added support for the GT (including the much awaited custom shaping feature that Future Motion had yet to release), Future Motion sent me a cease and desist saying that the tools I had built were violating the anti-circumvention provisions of USC 1201, which has a lot of the vague language regarding DMCA law.

While I don't agree with that interpretation, I didn't have the resources to fight it. I decided to pull down all of Rewheel to avoid a long, drawn out process of fighting it in court over something I built as a hobby project for free. That hasn't stopped the community though - they had cloned the repository and have since been hosting it themselves. While I'm no longer affiliated with the project, it's been cool to hear that people are still making modifications of their own.

When I travel and go on group rides, it's been amazing to see the impact of Rewheel on their riding. To hear about a hobby project you built for your own curiosity and frustration spoken about in online forums, in person and even made into both an adjective and a verb, it makes me super proud. It's validation that there was (and is) a huge space to improve the experience for Onewheel riders.FF

I've got some ideas for how to take it further, but more on that soon :)