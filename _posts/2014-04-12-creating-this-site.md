---
layout: post
categories: tagline: some short notes
tags: 
 - development
 - jekyll
 - edit
 - github
frontpage: true
published: true
---



{% include JB/setup %}

This is a short writeup of the history of creating this page.

Out of the noise in the internet some things pop up more recently.
This was the case with OpenStreetMap and also with GitHub Pages. You read
about some things, but you don't have an idea what it is about. Then
you dive more into and find it fun to play with it. You discover more
functionality and get more experienced...

Jekyll on GitHub is fun...

# Create / Read/ Update / Delete
For a blogging platform it is import to have Create/Read/Update/Delete (CRUD) functionality. Because this blog is powered by GitHub Pages this means to interact with GIT via the Github API. The normal Jekyll way is to install GIT/GitHub software on your computer and make these changes locally and then push it to GitHub. Github renders the page and serves it to the public. 

I wanted to be able to take some notes also from my Smartphone where no GIT is installed. An intermediate solution is to use prose.io - an online GUI for editing content on GitHub accounts. I thought it would be cool to have this kind of functionality more integrated with my blog. So I introduced a Markdown editor and a
JavaScript library to interact with the GitHub API. This was simple 
and I was able to change the content of the posts and commit it
back to GitHub in April 2014.

## Detail
To auhenticate with Github the preferred way is the Oauth2 worklow. The goal is to geht a token which gets attached to every request.... After getting the token the APP retrieves the user information. To get the info if a user is the site admin I do a test commit. If it succeeds, the user is the admin, if it fails he is not.

Reise the seit page for New content and updates in existing content

For delete confirmation I wanted a modal window
to confirm that you really, really want to delete - so the
(dialogs)[https://github.com/m-e-conroy/angular-dialog-service) where introduced...

One feature missing is the support of folders inside the _posts directory to keep
the folder a little bit more organized. It would be also great to have some
basic support of image uploading...

## Editing config files with the GUI
There are two different config files. A Frontend config file, which configures e.g. the home repository Name ... and a Backend configuration file which is needed for the Github Pages Site Generation... Booth can be edited Form the GUI.

# Forking
I thought it is cool to have a zero effort fork process and get a
clone of this blog with just one mouse click. Therefore I imported
a JavaScript project to communicate with the GitHub API to control
forking, branching, renaming of this blog.

The process is as following: I keep a template branch next to the
master branch which is missing e.g. the different posts (which a
users don't want in their fork). As soon
as the user is logged in with his GitHub account he can visit the
admin-fork page. He presses the fork button. Now a fork of my repository
is created. Now it is time to rename the repo to match the users'
decision on the site name. The renamed repo still  contains the
master & the template branch. Because GitHub renders the Github
Pages out of the master branch which contain all of my posts.
Therefore firstly the master is deleted on the forked
repo and then the template branch is renamed to master.

One last postprocessing step is to adjust _config.yml to insert
the page slogan chosen by the user - get the content of _config.yml
and find/replace the "title". Then commit. That's it...

## Promises
This is the first time I started with promises to chain the different
operations together. It is very important for me to have clean, easy
understandable code. I think promises helped me alot. This is how it looks like:

{% highlight javascript linenos=table %}
GithubSrvc.fork($scope.options)
.then( function() {
  return PollingSrvc.checkForBranchContent("maltretieren.github.com", "master")
})
.then( function() {
  return GithubSrvc.renameRepo(forkName);
})
.then( function() {
  return PollingSrvc.checkForBranchContent(forkName, "template")
})
.then( function() {
  return GithubSrvc.deleteBranch(forkName, "heads/master")
})
.then( function() {
  return GithubSrvc.createBranch(forkName, "master")
})
.then( function() {
  scope.pop();
});
{% endhighlight %}

# Getting more professional
As soon as I started out with the GitHub fork functionality there the need
for a deployment workflow rises because it was needed to commit to a master
branch and get a template branch out of it, but filtering out some stuff.

I found http://www.dhar.fr/blog/2012/07/23/some-fun-with-git-hooks-and-grunt-dot-js/
which describes how to deal with commits to two branches: it uses the hooks
in git to run a script after every commit... It switches to template branch (checkout)
and then removes the posts in _posts and commits to template branch.
