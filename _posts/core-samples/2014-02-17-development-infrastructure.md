---
layout: post
categories :
  - frontpage
tagline:
tags : [development]
---
{% include JB/setup %}

## Development tools
* Webstorm
* GitHub

## Develop local, run remote
No need to install an IDE on the Raspi - develop on your local computer, run on your Raspi while the files are synchronized as soon as you change it locally.

![Develop local, run remote](/assets/images/DevEnvironment.png)

    1. setup your favorite code editor and start a new project
    2. ssh into your Raspi {% highlight sh %}ssh pi@192.168.178.30{% endhighlight %}
    3. mount the dev folder on your laptop into the Raspi  {% highlight sh %} sshfs -o nonempty crunsh@192.168.178.26:/Users/crunsh/Documents/node_workspace/sound /home/pi/workspace_remote/sound {% endhighlight %}
    3.1 start the program inside the Raspi {% highlight sh %}./dev_start.sh{% endhighlight %}
    4. access the program by entering the IP of the Raspi in your browser (on your laptop/mobile)


