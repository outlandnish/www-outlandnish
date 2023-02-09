---
title: "Eco-ish Hack: Converting My Car to Use E85 (and Other Flex Fuels)"
description: This link is a draft and won't be built.
date: 2020-05-04
external: false
---

## Background

Well, my car already ran on E85 before I blew up the engine in August 2019 at Road Atlanta. While I was waiting for a new engine, I took apart the Delicious Tuning Flex Fuel Kit to see what was inside because I can't stop myself[^1].

I didn't know it at the time, but I forgot a piece of electrical tape as I put it back together. When it was time to tune my new engine for flex fuel, I realized the sensor wasn't working. I saw this lovely corrosion when I took it apart:

![Corroded DT Flex Fuel Kit](//images.ctfassets.net/ulmwkzhz2s13/5HmRZEAWsIbXDkRHiN6giP/fe67340bf85ea72c470b82fd6451976b/IMG_20200420_180055.jpg "Corrosion from coolant killed the power + ethanol sensor inputs")

I didn't want to spend a lot of money on a new ethanol content analyzer because of my own stupidity. Luckily, the internet came to rescue! People have been building Arduino based ethanol content analyzers for their cars for years. Why not give it a shot?

## The Ethanol Content Sensor

Most ethanol content analyzers on the market uses a sensor from Continental, one of GM's suppliers[^2]. The original kit used one of these and it was easy enough to move the connections from the old board to my new Arduino based setup.

Ethanol content sensors run off 12V power from the car and have a single open drain output that is pulsed to ground at a frequency between 50Hz and 200Hz. Converting to ethanol content is basic arithmetic:

$$
frequency - 50 Hz = ethanol
$$

There's other fun data like fuel contamination detection and fuel temperature, but none of that is needed. Let's keep it simple.

## Output Data to the Car

We have a way to detect ethanol content. How do we tell the car what's going on?

Once again, we can thank the aftermarket! There are both open source and proprietary solutions that reflash a stock ECU with custom mappings.

One of the cool features you can do is remap an existing input on the engine for completely different (or new functionality). ProECU, the solution my tuner uses, supports that for flex fuel inputs.

The original ethanol content analyzer re-uses the secondary O2 sensor as the input. The conversion is as follows:

```
0.5V = 0% Ethanol
4.5V = 100% Ethanol
```

Values in between are linearly interpolated for the appropriate ethanol content.

## Putting it together

Every single tutorial online said to use an Arduino Nano. In each of these cases, hardware timers are utilized on the Nano to count the frequency of the ethanol content sensor.

Here's a circuit diagram of a typical setup:

A 4.7kΩ pulls up the input signal from the ethanol content sensor up to a 5V reference on the Arduino. This ensures the signal doesn't float when the ethanol content sensor hasn't pulled it to ground.

On the output side, we have to do a bit more work. Since the Arduino can't output an analog signal without a DAC, we'll use a PWM output instead. To smooth out the signal, we run it through an RC (Resistor-Capacitor) circuit that acts as a smoothing filter to the voltage. For this setup, we use a 3.3kΩ resistor and a 0.1μF capacitor.

Done! We'll need some firmware that counts the frequency and converts it into an appropriate output voltage.

![Custom ECA next to DT ECA](//images.ctfassets.net/ulmwkzhz2s13/1IL07WCxoLgcTKMj7xQDGa/7dd9814e22198c1f3d441e9cd8051307/IMG_20200424_185930.jpg "Itty bitty ECA (bottom) next to the DT ECA (top)")

### The (inevitable) catch

Idiot Nish struck again. Instead of an Arduino Nano, I accidentally purchased the **Arduino Nano Every**, which apparently is a **COMPLETELY different** device with a different chipset and hardware timers from the Arduino Nano.

Better yet, no one had (publicly) messed with hardware timers on this platform and it was really hard to find and understand the documentation[^3].

Well...shit.

Since I didn't know anything about hardware timers, I thought I could get clever and just use software interrupts to detect each time the signal went high and low. The time between high signals would be the period of the signal (which we can use to convert to frequency) and the high time would be the duty cycle.

![Incorrect Flex Fuel Output](//images.ctfassets.net/ulmwkzhz2s13/3DcoDsbDcfihjKvrDLjoPT/a06537eb8e5d8e0a1673c9b8518b219f/eca-output.png "Random steps (and oscillations elsewhere) in the ethanol output")

It sort of worked... Unfortunately, there was enough overhead in the software that this wasn't completely accurate. The signal would have random oscillations and steps because of some weird timing issues. It was pretty much useless as an input for ethanol content.

### Back to the Drawing Board

Left with no other option, I had to figure out the hardware timers on the Atmega4809 in the Nano Every. This would involve directly manipulating hardware registers and flipping bits. It's a daunting task for someone who typically lives in the world of javascript. **The horrors**[^4]!

After days of searching through some not so great documentation, I finally found some sample code that answered this exact problem.

The Atmega4809 has pretty extensive set of subsystems that can be wired up to each other through firmware. The ones we care about are the Analog Comparator (AC) and the Timer-Counter type B (TCB) hardware timer.

![Atmega4809 Analog Comparator](//images.ctfassets.net/ulmwkzhz2s13/2D3pJ7PJdMq1A9k7at7lBL/4599ddf41560231a54aaf78b0a9680bc/Screenshot_2020-05-07_ATmega4808_4809_Data_Sheet_-_ATmega4808-4809-Data-Sheet-DS40002173A_pdf.png "Source: Microchip's Atmega4809 Datasheet")

In circuitry, a comparator has two inputs: an inverting input and a non-inverting input. If the inverting is higher than the non-inverting, we output a high signal. And vice versa, we output a low signal. The signal output from the comparator goes into one of the hardware timers, which counts how long the signal was high and low.

For our ethanol signal, we'll compare the voltage of our ethanol content sensor to internal voltage reference set at 1.5V. The code below is sets up the AC and feeds its output into the TCB:

```c++
// Port D, Pin 4 (Analog Pin 6) - disable digital input buffer
PORTD.PIN4CTRL = PORT_ISC_INPUT_DISABLE_gc;

// Use internal voltage reference @ 1.5V
VREF.CTRLA = VREF_AC0REFSEL_1V5_gc;
// AC0 DACREF reference enable
VREF.CTRLB = VREF_AC0REFEN_bm;

// Set DAC voltage reference
AC0.DACREF = DACREF_VALUE;
// AC Pin 1 as positive input, DAC Voltage Reference as negative input
AC0.MUXCTRLA = AC_MUXPOS_PIN1_gc | AC_MUXNEG_DACREF_gc;
// Enable analog comaparator, output buffer enabled
AC0.CTRLA = AC_ENABLE_bm | AC_OUTEN_bm;
// Analog Comparator 0 Interrupt Disabled
AC0.INTCTRL = 0;

// Setup AC output as event generator for channel 0
EVSYS.CHANNEL0 = EVSYS_GENERATOR_AC0_OUT_gc;
// Connect TCB0 user to event channel 0
EVSYS.USERTCB0 = EVSYS_CHANNEL_CHANNEL0_gc;
// Configure TCB in Input Capture Frequency Mode
TCB0.CTRLB = TCB_CNTMODE_FRQ_gc;
// Enable Capture or Timeout interrupt
TCB0.INTCTRL = TCB_CAPT_bm;
// Enable Input Capture event
TCB0.EVCTRL = TCB_CAPTEI_bm;

// Enable TCB and use clock from TCA (250 kHz)
TCB0.CTRLA = TCB_CLKSEL_CLKTCA_gc | TCB_ENABLE_bm | TCB_RUNSTDBY_bm;
```

It looks like a lot of gibberish, but that code is a hardware implementation of the original software interrupt idea. The big difference is the logic is now happening at the electrical signal level. Pretty insane, right?!

We need to convert this timer count into a frequency. The trick here is figuring out what each count on the timer equates to in time.

Because we've told the TCB0 timer to use the same clock as the TCA timer (which runs the PWM outputs on the Nano Every), we know it runs at 256kHz. To get frequency from this period, we do a bit more math:

$$
period = {1 \text{ second} \over 256000 \text{ ticks}} * ticks
$$

$$
frequency = {1 \over period}
$$

All that's left is to scale the output to our 0.5V - 4.5V range and we're done!

I added some exponential filtering to smooth out the input and output signals. A couple sanity checks (like no frequencies above 200Hz) ensure we don't spit bad data into the car. No sense in blowing up another engine 🙃

## And we're done!

To finish it up, I 3D printed a case for it and made sure to add that electrical tape this time around. Here's the finished product:

![Assembled ECA](//images.ctfassets.net/ulmwkzhz2s13/1UAjfyrMzdQhmDKvxyeryV/96ebb3665420e56ef51ee71bc4674aa3/IMG_20200425_223308.jpg "Final ECA before adding electrical tape 😬")

As usual, the source code can be [found on GitHub](https://github.com/outlandnish/firmware-ethanol-content-analyzer "source code on GitHub").

Now my car runs on the juicy nectar of the corn gods and has a bit more power. Yay bio-fuels! (But for real, I need to switch to an EV)

### Footnotes

[^1]: Dear future Nishanth, maybe don't take apart a device that partially controls the safety of your car
[^2]: Incidentally, GM has one of the widest range of cars that support Flex Fuel from the factory.
[^3]: Think you can figure out the documentation? [Good luck](https://www.microchip.com/wwwproducts/en/ATMEGA4809)
[^4]: Do you think we'd be better or worse off if all high level programmers were forced to understand the low level inner workings of microprocessors? Personally, I think we'd all be too mortified to continue the profession. 😅
