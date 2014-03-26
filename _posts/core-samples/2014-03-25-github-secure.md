---
layout: post
categories: 
  - frontpage
tagline: with github.js
tags: 
  - development
  - test
published: true
---

{% include JB/setup %}

In my post about GitHub edits from GUI I described a way to commit content to the github repository via basic authentication - using a password sent from client to github. Without a secured channel this passwords fly around
openly - free to read for everyone listening. Therefore the users should use the https version of the site, not the normal http which is default when you enter the url in the address. The question is now howto redirect users
everytime to the more secure option? GitHub pages have whitelistet a plugin for redirect and they address the issue described before... https://github.com/jekyll/jekyll-redirect-from/issues/18