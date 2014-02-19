---
layout: post
categories : 
  - frontpage
tagline: "a post to the main page"
tags : 
  - jekyll
  - github
---
{% include JB/setup %}

## Jekyll on GitHub
Beside of hosting of code repositories, Github offers free hosting of Jekyll driven pages. Jekyll is a software to generate static website files out of templates. Instead of generating the files locally and push it to the repo, Github runs Jekyll on their infrastructure and you push the Jekyll files to your repository and Github builds it for you.

<!-- more -->

### First steps
Follow instructions on [Jekyll QuickStart](http://jekyllbootstrap.com/usage/jekyll-quick-start.html) to fire up the first Jekyll pages. This went quite well, except I had to generate an SSH key on my local computer and paste it to my GitHub repository.

### Test locally
To test the page locally put a file with the name "Gemfile" into the root directory of your page
```sh
source 'https://rubygems.org'
gem 'github-pages'
```

Now you run a local server. The option "-w" enables Auto-regeneration after a file has changed.

```sh
bundle exec jekyll serve -w
```

Access it via a browser:

```sh
http://localhost:4000/
```

### Online creation of posts
Due to the fact that github runs a jekyll build infrstructure you can create/edit posts online via github.com. Login at github.com and browse to the "_posts" directory of your github-page. Next to the path you will find a small "+" to create a new file.

If you click on it you can enter the content of the new post. Name the file following the pattern "2014-02-16-newPost.md". After you save the file, the post will be available on the front page.
