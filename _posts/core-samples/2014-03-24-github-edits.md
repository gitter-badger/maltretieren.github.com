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
test
This page uses github.js to retrieve the Markdown from Github, Display it via http://toopay.github.io/bootstrap-markdown/ and save it again with github.js. To save you need to know the password (HTTP Basic Authentication) for the repository... 

The API queries are limited to somehow 60 Requests/Hour.

> API rate limit exceeded for your IP. (But here's the good news: Authenticated requests get a higher rate limit. [Check out the documentation for more details](http://developer.github.com/v3/#rate-limiting).)

<div id="path" style="visibility:hidden">{{page.path}}</div>
<textarea rows="30" data-provide="markdown" data-iconlibrary="fa" data-savable="true" style="width:100%" id="content">
</textarea>