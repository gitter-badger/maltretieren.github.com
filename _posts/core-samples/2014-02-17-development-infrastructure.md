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
No need to install an IDE on the Raspi - develop on your local computer, run on your Raspi while the files are synchronized as soon as you change it locally. This is realized with sshf (SSH File System).

![Develop local, run remote](/assets/images/DevEnvironment.png)

* Setup your favorite code editor and start a new project (e.g. a NodeJS project based on [nodebootstrap](https://github.com/inadarei/nodebootstrap))
* SSH into your Raspi {% highlight sh %}ssh pi@192.168.178.30{% endhighlight %}
* Install sshfs
{% highlight sh %}sudo apt-get install sshfs{% endhighlight %}
* Make sure you can ssh into your local computer (on my Mac I need to activate the option "Einstellungen" - "Freigaben" - "Entfernte Anmeldung")
* Mount the dev folder on your laptop into the Raspi  {% highlight sh %} sshfs -o nonempty crunsh@192.168.178.26:/Users/crunsh/Documents/node_workspace/sound /home/pi/workspace_remote/sound {% endhighlight %}
* Start the program from Raspi
{% highlight sh %}./dev_start.sh {% endhighlight %}
* Access the program by entering the IP of the Raspi in your browser (on your laptop/mobile)

## Resources
http://brettterpstra.com/2013/02/10/the-joy-of-sshfs/


