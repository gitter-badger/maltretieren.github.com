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

This page uses github.js to retrieve the Markdown from Github, Display it via http://toopay.github.io/bootstrap-markdown/ and save it again with github.js. To save you need to know the password (HTTP Basic Authentication) for the repository... 

The API queries are limited to somehow 60 Requests/Hour.

<div id="path" style="visibility:hidden">{{page.path}}</div>
<textarea rows="30" data-provide="markdown" data-iconlibrary="fa" data-savable="true" data-width="100%" id="content">
</textarea>