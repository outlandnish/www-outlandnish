---
external: false
title: "Throwback Hack: The Apartment Pager"
description: Re-imagining apartment dweller door answering laziness using Twilio and a couple of serverless functions.
date: 2020-04-20
---

## Background

Back in my college days, those odd years between 2010 and 2014, I lived in a high rise apartment in the quiet and chill South Loop neighborhood of Chicago. From organizing hackathons to hosting couchsurfers to odd drunken Thanksgiving potluck / game nights, my apartment hosted a number of people. However, one thing was always frustrating for a lazy person like me: buzzing people up.

## The Original Solution

To solve this very first world problem, I decided to build some technology that would answer the door for me. If the visitor knew the password, they'd be allowed up, all without any interaction from me 🎉 Here's the general flow of the hack (shown below)

1. I changed my apartment directory listing to a Twilio hosted phone number.
2. Before an event, I would set a password and distribute that from my Azure hosted web app
3. When a visitor pages up, Twilio would hit the web app for a voice query to present to the user for the event
4. After the visitor types in the password on the keypad, Twilio hits the web app with the entry
5. If the password is correct, the web app response to Twilio to press the DTMF code to enter the building
6. The door opens 🚪

## Revisiting the Hack, 6 years later

Since I built this hack in 2013 (and open sourced it in 2014), the world has moved along quite a bit in the way we design web apps. It doesn't hurt that I have a bit more experience building apps for scale as well.

There's only one thing that can be said about the original codebase:

#### SO. MUCH. FUCKING. CODE.

We don't need a big stinking web app to manage an apartment portal. The original codebase was a Node.js app with a DocumentDB NoSQL backend and Angular frontend. I even used web sockets in that project for some reason!

## The Modern Approach

1. Move the Twilio webhooks into serverless functions
2. Deploy to hosting service - I personally love using [Netlify](https://netlify.com)
3. Set the password, event title and active times in environment variables

That's it. I was the only user of the app: I didn't need a UI for other people to be able to create events and setup passwords and the time restrictions.

## Parting Thoughts

A lot of times, we build extravagant technology for the sake of flashiness or a myopic vision we have in our head. Going back and looking at this project, it's a good reminder for me (and hopefully you) to think smaller and build faster. Projects like these are fun and a great way to explore new tech, but reducing scope and focusing on the outcome is waay more important than building a flashy product.
