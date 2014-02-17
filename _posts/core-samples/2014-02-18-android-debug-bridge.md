---
layout: post
category: development
tagline: a post to the main page
tags: 
  - development
published: true
---

{% include JB/setup %}

## Android Debug Bridge (ADB)
With the Android Debug Bridge (ADB) you can connect your Smartphone to your computer via USB (or WLAN) and send
commands from the computer to the Smartphone. My plan is to use the Smartphone as a display for my Raspberry Pi.

<!-- more -->

### Shutdown
adb shell "reboot -p"

### Power Up
Adb is not working when the phone is power off. One method to bootup the phone is to make a switch for the USB cable power.
Another hack could be to disassemble the phone and attach a switch to the power button which can be controlled by the
RasPi.

### Toggle Screen on/off"
adb shell input keyevent 26

### Start App