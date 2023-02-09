---
title: Ditch the Sim Rig! Use Your Car Instead
description: Use DIY CAN bus tools to convert your car into the best sim rig ever
date: 2019-08-13
external: false
---

## Background

On one fated late August day, my Subaru BRZ came to a surprising halt in the keyhole at Road Atlanta. It was going to take a while to source and buy a new engine and I still wanted to get some seat time in.

Enter a crazy idea: Why not use the car's electronics to control a virtual BRZ on Forza?! 🤔

Seat time is the best way to develop your skills as a driver. It's hard to keep your skills sharp when you're not at the racetrack. Most people turn to buying sim rigs to alleviate that.

## Why would you do this?

These usually include a gaming PC (or console), steering wheel, pedals, gear shifter, monitor rig, racing seat, handbrake, VR headset, and a rig or frame to tie everything together.

These setups spiral up in cost as you start to invest in it. This is exacerbated once you want to replicate the feel of an actual car with direct drive steering wheels, load cell pedals, and all sorts of other fancy but really expensive components.

![Sim Racing Girl](//images.ctfassets.net/ulmwkzhz2s13/4kwVYHJZnkmaMDAJwkxJrh/07423ee2ea33154878f013d58840eacb/simracinggirl-in-her-gaming-rig.jpg "Sim Racing Girl - Photo Credit: Red Bull / Dennis Noten")

## The Idea

1. Tap into the BRZ's CAN bus for steering, throttle, braking, etc. signals
2. Convert car data into joystick data
3. Control an Xbox or PC with fake joystick

To work with an Xbox, we feed our data into an Xbox Adaptive Controller (more on that below). You can remove some of the complexity and cost of this solution if you're only targeting a PC. The Xbox solution, however, works for both PC and Xbox.

Even with the purchase of the Adaptive Controller, the total cost of parts comes to less than the cost of an entry level steering wheel, the Logitech G29. The parts breakdown is as follows:

#### PC Setup

| Name        | Price  | Quantity | Sub-Total |
| ----------- | ------ | -------- | --------- |
| Macchina M2 | $97.50 | 1        | $97.50    |

##### Total: $97.50

#### Xbox Setup

| Name                     | Price  | Quantity | Sub-Total |
| ------------------------ | ------ | -------- | --------- |
| Macchina M2              | $97.50 | 1        | $97.50    |
| Xbox Adaptive Controller | $99.00 | 1        | $99.00    |
| Xbox Trigger Breakout    | $9.99  | 1        | $9.99     |
| 3.5mm cable              | $9.99  | 2        | $18.98    |

##### Total: $225.48

## Hack Overview

![Hack Overview](//images.ctfassets.net/ulmwkzhz2s13/4x5KN86r7GbssUCjjE8H0W/431cd934f5c0243829916c565dfd063c/Untitled.png "View interactive version on <a href='https://whimsical.com/LEaxoE2snXgzqDDgCJ9bak'>Whimsical</a>")

1. The M2 listens to CAN traffic over the car's J1962 OBD2 port.
2. The M2 emulates an HID joystick using this data over USB.
3. _(Xbox - Required, PC - Optional)_ The M2 sends brake and accelerator data to the MCP4261 digital potentiometer via SPI to generate signals for the left and right triggers and are sent via 3.5mm cables.
4. _(Xbox - Required, PC - Optional)_ Finally, the Xbox controller connects to either the PC or Xbox.

## Step 1: Communicating with your car

As mentioned before, your car has a bunch of different ECUs and sensors that communicate over a CAN bus. The easiest way to tap into this data is by using the standardized OBD2 port.

While there are tons of CAN reverse engineering tools available, I chose the Macchina M2 because of its developer friendliness out of the box.

![Macchina M2 UTD](//images.ctfassets.net/ulmwkzhz2s13/3eTd11kQeAEIZ10tGg8Lkg/5047a93e7939139e73632ce705c8d1e0/M2_UTD.jpg "Macchina M2 Under the Dash Kit")

You can use a tool like SavvyCAN (using the M2RET firmware) or Comma AI's Cabana to reverse engineer the signals for your car. I had previously done so and utilized the following signals for the Subaru BRZ (it works for almost all modern Subarus)

- Accelerator Pedal Position
- Brake Pedal Position
- Steering Wheel Angle
- Clutch Engaged or Not (0 or 1)
- Gear Engaged or Not (0 or 1)
- Reverse Engaged or Not (0 or 1)
- E-brake Engaged or Not (0 or 1)

On manual BRZs, you cannot get the exact gear the car is in (this is derived from engine RPM and vehicle speed when you're on the road). We'll workaround this in the future. **UPDATE**: [Gear detection now works thanks to a motion sensor](https://outlandnish.com/blog/gear-detection-with-motion-sensors "Gear detection with motion sensors")!

You can find the [firmware for the Macchina M2 on GitHub](https://github.com/outlandnish/m2-xbox-controller).

## Step 2: Emulating a Joystick - Xbox and PC

We can utilize the Atmel SAM3X's native USB functions on the M2. By emulating an Human Interface Device (e.g. mouse, keyboard, joystick) gamepad, we can pretend that the car is the joystick. Using a modified version of the ArduinoJoystickLibrary, we setup HID descriptors that will differ depending on if you're using a PC or Xbox:

| Signal      | Xbox Mapping            | PC Mapping    |
| ----------- | ----------------------- | ------------- |
| Accelerator | Right trigger (MCP4261) | X axis        |
| Brakes      | Left trigger (MCP4261)  | Y axis        |
| Steering    | Left thumbstick         | Z axis        |
| Upshift     | L                       | N/A           |
| Downshift   | X (remapped from X1)    | N/A           |
| Gears 1 - 6 | N/A                     | Buttons 0 - 5 |
| E-Brake     | A                       | Button 8      |
| Clutch      | Left bumper             | Button 9      |
| Rewind      | Y (remmpped from X2)    | N/A           |

## Step 3: Brakes and Throttle - Xbox Only

For Xbox, we need to pipe the USB joystick data into an Xbox Adaptive Controller to workaround the limitation of only Xbox licensed hardware It would've been nice to use the USB port on the Adaptive Controller for all inputs. Unfortunately, we've got two issues:

1. You can't control triggers from the USB inputs
2. On the Xbox, you can't remap a joystick axis to the trigger

Instead of wasting the granularity of our throttle / brake pedals on a digital on/off, we'll utilize the Adaptive Controller's 3.5mm inputs for the triggers to get the full range of control.

We use an 3.5mm audio jack that includes microphone input. This is so that the controller can provide us a reference voltage of 1.8V to run our 10k potentiometer against. We feed this into the digital potentiometer and control the resistance over SPI.

![Xbee Trigger Breakout](//images.ctfassets.net/ulmwkzhz2s13/4JhbYla6T1UeNl6ja2pt9j/5161a0e021a31400659ddfd4d1d9a112/IMG_20190914_103455.jpg "Xbox Trigger Breakout on the M2")

To make for a cleaner setup, I made this Xbee breakout for the M2 for both triggers. You can purchase it here: [https://www.tindie.com/products/18061/](https://www.tindie.com/products/18061/)

![gamepad-triggers](//images.ctfassets.net/ulmwkzhz2s13/68j74rm3tSTBdIYvQiwz9h/efc7c2c320230728f019ed533b484abe/gamepad-triggers.gif "Voila, left and right triggers! 🎮")

## Step 4: Put it all together

Now that we've got all the separate bits, we can put the system together! Here's a video of the first startup:

video: https://drive.google.com/file/d/1izpVlm9VPHIvaXp_vknXZXnA7jk4NDMh/view?usp=sharing

Now, just add friends and you get a pretty snazzy setup for time attack and drift competitions! Cheers 🙌

## Next Steps

- It'd be great if the Macchina M2 was not hardcoded to CAN addresses. In the future, it'd be awesome to load DBC files on the Macchina M2's SD card to parse signals from the car.
- Force feedback support using the electric power steering and the ABS module. T*he Adaptive Controller doesn't support forced feedback so we'd need to workaround that.*
- License as an Xbox accessory so we don't need any of these workarounds - one can dream 🙏

## Credits / Thanks

- **[Macchina](https://www.macchina.cc/)** for a very DIY friendly tool to communicate to the cars, the M2
- **[Xbox](https://www.xbox.com/en-US/xbox-one/accessories/controllers/xbox-adaptive-controller)** for a) giving people with disabilities a chance to game and b) opening the doors to DIY controllers through the Adaptive Controller
