---
layout: post
uuid: 96f04330-b074-11e3-a5e2-0800200c9a66
preview: /assets/images/2014-03-12-raspi-accessoirs/relay.jpg
product: 1-Channel H/L Level Triger Optocoupler Relay Module for Arduino 5V
description:
price: 0,99€
link: http://www.ebay.de/itm/251383404102
categories:
- frontpage

tags:
- relay
- switch
- accessoire
- power
---

{% include accessoires/accessoire-table %}

The usecase in my project for the relay is related to following requirement: I have several devices connected to
my Raspi that needs external power supply - a usb hub that needs 5 volts external power, and a thermal printer,
that needs 9 volts. The devices are powered by an external battery pack (Note: In the schema below I replaced
the external circuits with external powered LED for simplicity). If I cut power from the Raspi (with ATX Raspi)
I also want to automatically cut the power of the externally powered devices so that the battery pack also deactivates
(which has no external off switch, but deactivates after some time if no device draws power from it).
This issue is solved by using two of these relays.

The relay needs 5 volts for operating. GPIO 2 is connected to VCC, GPIO 6 to GND of the relay. This serves power
to it. To activate the relay when Raspi starts the 3.3 volt GPIO 1 is connected to IN. Both red leds on the relay
will light up as soon as the Raspi has power.


{% include accessoires/image-caption.html url="/assets/images/Relay.png" description="Wiring of the relay. The 'output' circuits are replaced with an external powered LED for simplicity" %}