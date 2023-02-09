---
external: false
title: "10 Minute Hack: Timezone Based VPN Detection"
description: In this hack, I explore if you can use client side Javsascript to detect a VPN with some timezone trickery.
date: 2020-02-05
---

## Background

Services like Netflix and Amazon are pretty adept at detecting when a user is using a VPN to view geo-restricted content. Most of time, the strategy for doing so is to keep a list of known IP addresses for VPN endpoints and restrict content coming from those address ranges. It does require a bit of work on the service provider to track down those IP addresses and keep that up to date.

## A Dumb Idea

In a bout of insomnia, I had a fun thought: when you connect to a VPN, the user typically doesn't change the computer's timezone to match the VPN. When you're getting around content, there's a solid chance the country whose geo-restricted content you're trying to view is in a different time zone.

> What if you could compare the IP timezone to the computer timezone to detect when people did this?

It's a pretty easy idea to test. You can see a quick demo below:
![vpn-detection-gif](//images.ctfassets.net/ulmwkzhz2s13/6fv2ng2xlU3iapVx1Zrg1D/14a41b8f2889133bfd2048a2f99d4a90/demo.gif)

## Results

There are a couple (HUGE) caveats:

1. This assumes that the content isn't in the same timezone
2. The format of the the timezones you get from a geo IP request is the same as that of your browser function to get system time
3. The user doesn't simply change the computer time to match the IP time zone

All of these caveats were made pretty clear to me when I posted the idea to Hacker News:

![vpn-detection-comments](//images.ctfassets.net/ulmwkzhz2s13/5SYu01qPl8vN0KAgTWakOG/722495e4f5dd3f617050e5eb4123f1e6/vpn-detection-comments.png)

Needless to say, it wasn't too well received 😅

## Conclusion

While it may have seemed like a failure there are two nuggets of learning in there:

- As a developer, you can compare information from the network and the browser to understand your user a bit better.
- As a user, you now have a data point as to yet another way your privacy can potentially be leaked and is worth keeping in mind as you browse the internet.

For an idea that came about from insomnia and a couple minutes of spare time, I'm pretty happy with what I learned from it! Happy reminder to build out those random ideas that spring to mind (or at least write 'em down for a time you can play with the idea).
