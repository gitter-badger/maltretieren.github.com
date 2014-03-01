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

1. Setup your favorite code editor and start a new project
2. SSH into your Raspi
```
ssh pi@192.168.178.30
```
3. Mount the dev folder on your laptop into the Raspi
```
sshfs -o nonempty crunsh@192.168.178.26:/Users/crunsh/Documents/node_workspace/sound /home/pi/workspace_remote/sound
```
4. Start the program from Raspi (this is a startup script from [nodebootstrap](https://github.com/inadarei/nodebootstrap))
```
./dev_start.sh
```
5. Access the program by entering the IP of the Raspi in your browser (on your laptop/mobile)


