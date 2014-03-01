---
layout: post
categories: 
  - sound
  - raspi
tagline: on Raspberry Pi
tags: 
  - sound
  - raspi
published: true
---

## lsusb
{% highlight sh %}
Bus 001 Device 007: ID 0d8c:013c C-Media Electronics, Inc. CM108 Audio Controller
{% endhighlight %}

## Tools
{% highlight sh %}
sudo apt-get install alsa-tools alsa-oss alsa-utils
{% endhighlight %}

cat /proc/asound/cards

{% highlight sh %}
 0 [ALSA           ]: BRCM bcm2835 ALSbcm2835 ALSA - bcm2835 ALSA
                      bcm2835 ALSA
 1 [Device         ]: USB-Audio - USB PnP Sound Device
                      C-Media Electronics Inc. USB PnP Sound Device at usb-bcm2708_usb-1.2, full spee
{% endhighlight %}

### Change default device
sudo vim ~/.asoundrc
{% highlight sh %}
 pcm.!default {
   type plug
   slave.pcm {
     @func getenv
     vars [ ALSAPCM ]
     default "hw:0,1"
   }
 }
{% endhighlight %}

{% highlight sh %}
alsamixer + F3 -> adjust volume
{% endhighlight %}

## Play Audio
{% highlight sh %}
aplay numnuts.wav
{% endhighlight %}

## Text to Speech (TTS)
{% highlight sh %}
sudo apt-get install festival
{% endhighlight %}

{% highlight sh %}
echo "test" | festival --tts
{% endhighlight %}

### German voice
(http://www.ims.uni-stuttgart.de/institut/arbeitsgruppen/phonetik/synthesis/festival_opensource.html)