---
layout: post
category : test
tagline: "a post to the main page"
tags : [jekyll github]
---
{% include JB/setup %}

## Jekyll on GitHub
Beside of hosting of code repositories Github offers free hosting of Jekyll driven pages. This is great, and this posts documents some findings.

### First steps
Follow instructions on [Jekyll QuickStart](http://jekyllbootstrap.com/usage/jekyll-quick-start.html) to fire up the first Jekyll pages. This went quite well, except I had to generate an SSH key on my local computer and paste it to my GitHub repository.

### Test locally
```sh
bundle exec jekyll serve -w
```