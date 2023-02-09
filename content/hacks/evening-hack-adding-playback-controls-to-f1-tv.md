---
title: "Evening Hack: Adding Playback Controls to F1 TV"
description: How does a modern media player not have playback controls? Here's a quick hack to fix that for F1 TV.
date: 2020-07-02
external: false
---

One of the things YouTube has done well has made certain shortcuts for videos ubiquitous. The flipside is that when an HTML5 video doesn't have those shortcuts, it's annoying.

That's the case with F1 TV. So, with my new found browser extension building skills, I decided to tackle that one issue (of the very many) that plague the F1 TV website.

There really isn't much to blog about in this one, but here's some things that were interesting to learn on my browser extension journey.

Before going any further, you can pick up the code for my extension [on GitHub](https://github.com/outlandnish/ext-f1-tv "F1 TV Playback Controls extension source code on GitHub").

## Learning About Extensions

You can run several types of scripts ranging from popups in the toolbar, background scripts, content scripts, and developer tools scripts. Each one of these has its own unique restrictions and ways to interact with the website. I'm not going to go into each in detail here, but it was interesting to learn about.

### Javascript Isolates

In my case, I used a content script to inject code into the website. However, this code runs in its own isolated Javascript sandbox.

If you're waiting for interactions to happen in the client Javascript, you'll be waiting forever. One of these examples is that I tried injecting, loading and waiting for the Google Cast API to initialize.

To get around this, you can inject Javascript (or CSS) elements directly into the DOM. If you're providing an external file like I did, you have to declare this in your extension's `manifest.json` ahead of time and specify which browser addresses on which to perform the injection.

### YouTube Controls

Though I had pretty simple needs for playback, pause / play and minimal seeking, it turned out that YouTube power users have enjoyed a number of playback controls that I had no idea existed. Here's what they look like:

- **[space]**: pause / play the video
- **m**: mute / unmute the video
- **+** / **-**: increment / decrement the volume by 5%
- **[left arrow]** / **[right arrow]**: backward / forward by 5 seconds
- **j** / **l**: backward / forward by 10 seconds
- **f**: fullscreen
- **[1]...[9]**: skip to 10%...90% of the video
- **[home]**: seek to the start of video
- **[end]**: seek to the end of the video

### Implementation

The code is thankfully simple enough:

1. On F1 TV urls, it injects the script into the page.
2. A [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) is used to wait for the HTML5 `<video>` tag to be added to the page by `embedplayer.js`
3. It adds a keyboard listener to the browser window for the controls listed above and manipulates the `video` container.
4. That's it!

### Google Cast

Once you've got modern controls, it'd be nice to get that image up on the big screen, yeah? I ended up learning about Google's Cast Application Framework.

Since the HTTP Live Streaming (HLS) streams from F1 were authenticated, I wasn't able to just point the Cast device to the video stream and have it do the magic.

Instead, I had to build a Cast Receiver. On load, your browser sends the auth cookies over so that it can send each request with the proper headers. One static site on Netlify later, we've got a proper Cast setup going 🎉

But now we've got some additional complexity. We need to know whether to send playback controls to either the Cast device or to the appropriate tab.
