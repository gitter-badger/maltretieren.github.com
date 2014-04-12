---

layout: post
categories: 
  - frontpage
tagline: with github.js
tags: 
  - development
  - jekyll
  - edit
  - github

published: true

---

{% include JB/setup %}

This is a short writeup of the history of creating this page.

Out of the noise in the internet some things popup more recently.
This was the case with OpenStreetMap and also with Github. You read
about some things, but you don't have an idea what it is about. Then
you dive more into and find it fun to play with it. You discover more
functionality and get more experienced...

Jekyll on Github was fun. I disliked the provided

# Forking
I thought it is cool to have a zero effort fork process and get a
clone of this blog with just one mouse click. Therefore I imported
a JavaScript project to communicate with the GitHub API to control
forking, branching, renaming of this blog.

# Getting more professional
As soon as I started out with the GitHub fork functionality there the need
for a deployment workflow rises because it was needed to commit to a master
branch and get a template branch out of it, but filtering out some stuff.