---
layout: post
categories: 
  - tutorial
tagline:
tags:
  - development
published: true
---

## Install nodejs/npm on Raspberry Pi
http://joshondesign.com/2013/10/23/noderpi

### Setup system-wide environment variables
sudo vi /etc/environment

NODE_JS_HOME=/home/pi/node-v0.10.2-linux-arm-pi
PATH=$PATH:$NODE_JS_HOME/bin

### Access Permissions
Do not use "sudo" for install npm packages. Instead change permissions on the folders for curront user...

## Nodejs Video Tutorials
[Modular web applications with Node.js and Express](http://vimeo.com/56166857)
