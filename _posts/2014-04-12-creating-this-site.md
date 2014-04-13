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

Jekyll on Github was fun...

# Editing
First I found prose.io - an online GUI for editing content on GitHub
accounts. I thought it would be cool to have this kind of functionality
more integrated with my blog. So I introduced a Markdown editor and a
JavaScript library it interact with the GitHub API. This was simple
and I was now able to change the content of the posts and commit it
back to GitHub. After GitHub rendering it is available for all people...

# Forking
I thought it is cool to have a zero effort fork process and get a
clone of this blog with just one mouse click. Therefore I imported
a JavaScript project to communicate with the GitHub API to control
forking, branching, renaming of this blog.

The process is as following: I keep a template branch next to the
master branch which is missing e.g. the different posts. As soon
as the user is logged in with his GitHub account he can visit the
fork page. He presses the fork button. Now a fork of my repository
is created. Now it is time to rename the repo to match the users'
decision on the site name. The renamed repo still  contains the
master & the template branch. Because GitHub renders the Github
Pages out of the master branch which contain all of my posts.
Therefore firstly the master is deleted on the forked
repo and then the template branch is renamed to master.

One last postprocessing step is to adjust _config.yml to insert
the page slogan chosen by the user - get the content of _config.yml
and find/replace the "title". Then commit. That's it...

# Getting more professional
As soon as I started out with the GitHub fork functionality there the need
for a deployment workflow rises because it was needed to commit to a master
branch and get a template branch out of it, but filtering out some stuff.

I found http://www.dhar.fr/blog/2012/07/23/some-fun-with-git-hooks-and-grunt-dot-js/
which describes how to deal with commits to two branches: it uses the hooks
in git to run a script after every commit... It switches to template branch (checkout)
and then removes the posts in _posts and commits to template branch.  