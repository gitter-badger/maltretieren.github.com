---
layout: post
categories :
  - frontpage
tagline: "a post to the main page"
tags : [development]
---
{% include JB/setup %}

## Development tools
* Webstorm
* SourceTree


## Develop local, run remote
No need to install an IDE on the Raspi - develop on your local computer, run the code on the Raspberry while it is listening for changes and updates quickly. You could either put the development folder to the Raspi and sshfs from your computer to this folder. The other way round it is more convinent as you can also develop even without connection to the Raspi.

![Develop local, run remote](/assets/images/DevEnvironment.png)

    1. setup your favorite code editor and start a new project
    2. ssh into your Raspi {% highlight sh %}ssh pi@192.168.178.30{% endhighlight %}
    3. mount the dev folder on your laptop into the Raspi  {% highlight sh %} sshfs -o nonempty crunsh@192.168.178.26:/Users/crunsh/Documents/node_workspace/sound /home/pi/workspace_remote/sound {% endhighlight %}
    3.1 start the program inside the Raspi {% highlight sh %}./dev_start.sh{% endhighlight %}
    4. access the program by entering the IP of the Raspi in your browser (on your laptop/mobile)


