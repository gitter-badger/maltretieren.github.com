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

<div id="path">{{page.path}}</div>

<form role="form" action="#">
  <div class="form-group">
    <label for="exampleInputEmail1">Username of the repo hosting the Jekyll page</label>
    <input type="text" class="form-control" id="username" placeholder="Your Github Username" />
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="password" placeholder="Password" />
  </div>
  <button type="submit" class="btn btn-default" onclick=";">Get Markup</button>
<textarea rows="30" data-provide="markdown" data-iconlibrary="fa" data-savable="true" data-width="100%" id="content">
</textarea>
</form>
<script>
getMarkup()
</script>