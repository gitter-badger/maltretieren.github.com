---
layout: page
title: Sense it!
tagline: ... or make sense!
---
{% include JB/setup %}

## Introduction
I recently learned howto host a Jekyll driven page on GitHub. This site will be mainly for my own documentation, but if anyone is interested in some findings, I'm very happy :)

{% for post in site.posts limit: 5  %}
  <blockquote>{{ post.content }}</blockquote>
{% endfor %}
