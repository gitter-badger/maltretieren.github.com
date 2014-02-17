---
layout: page
title: Sense it!
tagline: ... or make sense!
---
{% include JB/setup %}

## Introduction
I recently learned about howto host a Jekyll driven page on GitHub. I like it because it removes complexity of own hosted blogging software and gives me more freedom than ready made blogging sites.

This site will be mainly for my own documentation, but if anyone is interested in some findings, I'm happy :)

---

{% for post in site.posts limit: 5  %}
  <p><a href='{{ post.url }}'>{{ post.title }}</a>, posted on {{ post.date | date_to_string }}</p>
   {{ post.content | split: '<!-- more -->' | first }}
   <hr/>
{% endfor %}
