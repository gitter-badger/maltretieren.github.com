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

This page uses [github.js](https://github.com/michael/github) to retrieve the Markdown from Github, edit it via  [Bootstrap Markdown Editor](http://toopay.github.io/bootstrap-markdown) and push to GitHub again with github.js. To save you need to enter the password (HTTP Basic Authentication) for the repository... 

The API queries are limited to somehow 60 requests/hour for unautorized requests, e.g. to receive the source code of this page.

> API rate limit exceeded for your IP. (But here's the good news: Authenticated requests get a higher rate limit. [Check out the documentation for more details](http://developer.github.com/v3/#rate-limiting).)

To enable the edit function you need to append ?edit=true to the address of the post.

<div id="path" style="visibility:hidden">{{page.path}}</div>
<textarea id="content" style="visibility:hidden">
</textarea>