---
layout: post
categories :
  - frontpage
tagline: "a post to the main page"
tags : 
  - jekyll
  - dynamic
  - cloud
---
{% include JB/setup %}

## Introduction
Jekyll is for static websites - but there are great services to put some dynamic elements inside your page.
The things described here in the need for some rating functionality. The article covers:

- a static database hosted on github
- star rating for the frontend for every entry in the database
- keen.io in the backend to store, compute the average and deliver the user ratings

It is quite simple and took me about 3 hours to figure out.

### Requirements
- make jekyll running on github
- add a uuid to each post and follow xyz to setup a "database"
- register on keen.io (you can use your github account)

### keen.io and count.io
Keen.io is a service to put some data into and it provides a nice way to get data out. Realising my little
project worked seamlessly easy. It is free for 50.000 "events" (see pricing).
On next level you get 100.000 events for 20$. See pricing on their webpage for more steps. More details on
how to use it are below.

Before I found count.io . The provide a simple (too simple) API and in the free version they store a counter
value only for 48 hours, if you don't read/write to it. That is not enough for my usecase.

### The path
I started with the GUI stuff - a quick search returned "raty", which is a jQuery plugin. Jekyll produces
a table out of all posts. Put the stuff to your assets and create raty divs for every entry in the database.
