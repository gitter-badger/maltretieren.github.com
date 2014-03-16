---
layout: post
preview: /assets/images/2014-03-12-raspi-accessoirs/relay.jpg
product: 1-Channel H/L Level Triger Optocoupler Relay Module for Arduino 5V
description:
price: 0,99€
link: http://www.ebay.de/itm/251383404102
categories:
- relay

tags:
- prototyping
- accessoire
---

<img src="{{page.preview}}" style="width:100px"/>

The use case in my project for the relay is connected to following requirement: I have several devices connected to
my Raspi that needs external power supply - a usb hub that needs 5 volts external power, and a thermal printer,
that needs 9 volts. The devices are powered by an external battery pack. If I cut power from the Raspi (with ATX Raspi)
also want to automatically cut the power of the externally powered devices. I solved this issue by using two of these relays.