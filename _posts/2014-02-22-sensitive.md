---
layout: post
categories: 
  -
tagline:
tags:
  - development
  - sensor
published: true
---

## Read sensor information from Smartphones
I recently found a nodejs library for reading sensor information from smartphones. It is called [sensitive](https://github.com/alanreid/Sensitive) and is developed by Alan Reid. Hey Alan, if you are reading this I want to thank you very much for your work you have done :)

## Step by step to use sensitive for your project
* install qrencode (
On Mac:
sudo port install qrencode
On Raspi
sudo apt-get install qrencode
* add sensitive to your nodejs project
* if you are already using express for your project its fine. Otherwise add connect/express to your dependencies
* make a folder public/tmp
* add application.js to public/js
* add sensitive folder to public/sensitive

## Challenges

### Multiple sockets
I already had a socket connection in my application. The sensitive page gave me following error:

On client side:
{% highlight sh %}
WebSocket connection to 'ws://localhost:8081/socket.io/1/websocket/1241201754246442188' failed: WebSocket is closed before the connection is established.
{% endhighlight %}

On server side:
{% highlight sh %}
debug: set close timeout for client 421488892666513105
info: socket error Error: write after end
    at writeAfterEnd (_stream_writable.js:130:12)
    at Socket.Writable.write (_stream_writable.js:178:5)
    at Socket.write (net.js:613:40)
    at WebSocket.onSocketConnect (/Users/crunsh/Documents/node_workspace/angular-socket-io-im-master/node_modules/socket.io/lib/transports/websocket/hybi-16.js:132:17)
    at WebSocket.Transport.handleRequest (/Users/crunsh/Documents/node_workspace/angular-socket-io-im-master/node_modules/socket.io/lib/transport.js:71:10)
    at WebSocket.Transport (/Users/crunsh/Documents/node_workspace/angular-socket-io-im-master/node_modules/socket.io/lib/transport.js:31:8)
    at new WebSocket (/Users/crunsh/Documents/node_workspace/angular-socket-io-im-master/node_modules/socket.io/lib/transports/websocket/hybi-16.js:59:13)
    at new WebSocket (/Users/crunsh/Documents/node_workspace/angular-socket-io-im-master/node_modules/socket.io/lib/transports/websocket.js:31:17)
    at Manager.handleClient (/Users/crunsh/Documents/node_workspace/angular-socket-io-im-master/node_modules/socket.io/lib/manager.js:635:19)
    at Manager.handleUpgrade (/Users/crunsh/Documents/node_workspace/angular-socket-io-im-master/node_modules/socket.io/lib/manager.js:595:8)
{% endhighlight %}
