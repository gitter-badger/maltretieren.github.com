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

    ssh into your Raspi
    mount the dev folder on your laptop from your Raspi
    {% highlight sh %}
    sshfs pi@192.168.178.30:/home/pi/workspace_node /Users/crunsh/Documents/node_workspace/pi
    {% endhighlight %}###

## Connect a folder on network device to your local computer



