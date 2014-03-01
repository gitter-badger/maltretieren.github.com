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
![Develop local, run remote](/assets/images/DevEnvironment.png)

1. setup your favorite code editor and start a new project
2. ssh into your Raspi
3. mount the dev folder on your laptop from your Raspi
{% highlight sh %}
sshfs pi@192.168.178.30:/home/pi/workspace_node /Users/crunsh/Documents/node_workspace/pi
{% endhighlight %}
4. access the program by entering the IP of the Raspi in your browser (on your laptop/mobile)

## Connect a folder on network device to your local computer



