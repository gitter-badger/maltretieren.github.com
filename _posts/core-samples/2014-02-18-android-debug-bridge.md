---
layout: post
categories: 
  - frontpage
tagline: a post to the main page
tags: 
  - development
  - android
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

### Toggle Screen on/off
{% highlight sh %}
adb shell input keyevent 26
{% endhighlight %}

### Simulate Swipe
To unlock you can simulate a swipe event (find your screen coordinates via the developer options):
{% highlight sh %}
adb shell input swipe 240 610 400 610
{% endhighlight %}
Because the swipe is done in a very short time it can actually happen that the device doesn't get unlocked. Try:
{% highlight sh %}
adb shell input swipe 240 610 400 610 | adb shell input tap 400 610
{% endhighlight %}

The command follows the pattern:
{% highlight sh %}
adb shell input [touchscreen|touchpad] swipe <x1> <y1> <x2> <y2>
{% endhighlight %}

### Open Browser with a specified URL
{% highlight sh %}
adb shell am start -a android.intent.action.VIEW -d http://www.google.de
{% endhighlight %}

### Advanced Scripts
The following bash script accepts parameters:
* -app (this sends a broadcast to an WebView app which opens the passed in url)
-

{% highlight sh %}
#!/bin/sh

ip=$(ifconfig en0 | grep inet | cut -d: -f2 | cut -d' ' -f2 | tr -d '\n'):8081
if [ -z "$1" ] ; then
  echo "nothing provided, open browser with standard ip"
  adb shell am start -a android.intent.action.VIEW -d "http://$ip/qr"
else
  echo "parameters provided..."
  if [ $1 = "-app" ] ;  then
    echo "open with app"
    if [ -z "$2" ] ; then
        echo "no address specified, open ip $ip"
        adb shell am broadcast -a com.example.Broadcast -e url "$ip/qr"
      else
        adb shell am broadcast -a com.example.Broadcast -e url $2
        echo "address speicified, open app with this address"
      fi
  else
    echo "open with browser specified address"
    if [ -z "$1" ] ; then
      ip = $1
    fi
    adb shell am start -a android.intent.action.VIEW -d "http://$1"
  fi
fi
{% endhighlight %}

### Monkeyrunner
send 100 random movements:
{% highlight sh %}
adb shell monkey --pct-motion 100 100
{% endhighlight %}

### Start App
Check if an app is started:
{% highlight sh %}
adb shell pgrep com.webview
{% endhighlight %}

If not, start the app:
{% highlight sh %}
adb shell am start -n com.webview/com.package.name.ActivityName
{% endhighlight %}

