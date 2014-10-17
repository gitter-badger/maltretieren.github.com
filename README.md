# Status and Overview
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/Maltretieren/maltretieren.github.com?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
This repository contains the source for my personal blog you can see in action at 
[https://maltretieren.github.io](https://maltretieren.github.io).
It is hosted on GitHub Pages and run by Jekyll. The user interface provides an easy way to edit/create posts
from within the browser. While [prose.io](http://prose.io) is a more generic solution for editing content on GitHub via a browser,
this site is focused on blogging software. With a few clicks you can create your own instance running on your
github account...

Click on the image below to see a demo video of how to copy this site to your github account...
[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/NDjB_7lAkO8/maxresdefault.jpg)](http://www.youtube.com/watch?v=NDjB_7lAkO8)

## Technical Status
[![devDependency Status](https://david-dm.org/Maltretieren/maltretieren.github.com/dev-status.svg)](https://david-dm.org/Maltretieren/maltretieren.github.com#info=devDependencies)
[![Build Status](https://travis-ci.org/Maltretieren/maltretieren.github.com.svg?branch=master)](https://travis-ci.org/Maltretieren/maltretieren.github.com)
[![Coverage Status](https://img.shields.io/coveralls/Maltretieren/maltretieren.github.com.svg)](https://coveralls.io/r/Maltretieren/maltretieren.github.com?branch=master)
<iframe width="560" height="315"  src="//www.youtube.com/v/NDjB_7lAkO8&hl=en&fs=1" frameborder="0"></iframe>
# Philosophy
Jekyll Bootstrap states: "The Quickest Way to Blog on GitHub Pages". I'm hoping to provide the
"Quickest and Easiest Way to Blog on Github Pages", because you don't even need to have any
software installed on your computer. You only need an GitHub account. You visit https://maltretieren.github.io
and "Login with GitHub" - Click on "Fork". That's it! You have your own instance running on your github
account. Create/Edit your own content from your site...

To use the power of the static site generator as much content as possible should be prerendered.
With the power of Javascript and external services you can make your static site even pretty dynamic.

## Features
- Free to Fork - MIT License
- GitHub Pages compatible (uses only GitHub whitelistet plugins)
- HTTPS always (redirect to HTTPS if the user visits via HTTP)
- Edit feature (append ?edit=true to the url and see, edit, provide password and save)
- Permanent Login via GitHub oAuth2 (login once, edit everytime) / Requires a piece of software running on Heroku. If you don't like that you can edit with your github username/password
- Interactive tables build out of blog posts - beautiful, searchable, sortable
- Comments via keen.io
- Ratings via keen.io
- Nice image captions

### Administration area
- Import/Export of posts
- Change user interface / backend configuration within the administration area 


## Directory Layout
Inspired by https://github.com/angular/angular-seed & https://github.com/plusjade/jekyll-bootstrap/

    _drafts                  --> blog posts, not published yet
    _includes                --> Jekyll includes
    _layouts                 --> Jekyll templates for different pages
    _plugins                 --> Only a Debug plugin, nothing else...
    _posts                   --> blog posts, sorted in subfolders
	_tests                   --> folder to put tests inside
	  conf/                  --> Karma configuration file: karma.conf.js
	  ..
    assets                   --> Unchanged assets, include version number in folder name
      img/                   --> Source files for graphics (yED)
      js/                    --> Libraries (not customized stuff)
        angular              --> AngularJS
        themes/              --> Bootstrap & Syntax files
          bootstrap-3.1.1    --> Bootstrap 3
          bg-patterns        --> Background textures
          syntax             --> CSS for syntax highlighting
    app                      --> Self created stuff
	    css                  --> Own CSS files, customizing some asset css files
		data                 --> Static data files
		    geojson/         --> GeoJSON files (from OpenStreetMap), to be rendered on GitHub
		img                  --> Images used in blog posts & 
		js                   --> App.js, Angular Controllers, Routes, Directives...
		partials             --> Templates loaded with AngularJS
	    
			

## Setup
- Login with your GitHub account / click on "Fork"
- Wait until you get feedback that your site is available...

### Enbable advanced features
#### Comments and Rating
- Register on keen.io to get comments & rating
- Adjust config with your keen details (for now the settings are stored inside the files)
- Goto xyz.github.io and provide your settings

#### Login with github
- If you want to use "Login with GitHub" you need to install Gatekeeper on e.g. heroku (register and deploy gatekeeper)

## Software Stack
### External Services
- [GitHub](https://github.com/)
    - you know it...
- [Keen.io](https://keen.io)
    - Cloud database (built for analytics)
- [Heroku](https://dashboard.heroku.com)
    - Hosting of nodejs apps (required for "client side" oAuth2 workflow)

### Frameworks / Libraries
- [Jekyll](http://jekyllrb.com/)
    - Static site generator
	- As a starting point I used [Jekyll Bootstrap](http://jekyllbootstrap.com/)
- [Bootstrap](http://getbootstrap.com/)
    - Responsive Design
- [AngularJS](http://angularjs.org/)
    - Dynamic Content
- [Bootstrap UI](http://angular-ui.github.io/bootstrap/)
    - Well, a single JavaScript file to wire Bootstrap and Angular
- [LABjs](http://labjs.com/)
    - ScriptLoader
- [Github.js](https://github.com/michael/github) 
    - GitHub commits from the client 
- [Wikiquotes Javascript API](https://github.com/natetyler/wikiquotes-api)
    - Programming related quotes on the frontpage
- [jQuery](http://jquery.com/)
    - you know it...
- [Raty](http://wbotelhos.com/raty/)
    - Star Rating jQuery Plugin
- [Bootstrap Markdown](http://toopay.github.io/bootstrap-markdown/)
    - Markdown Editor for the edit feature
	- (optional) dependencies to markdown.js and to-markdown.js for the preview functionality
- [JSO](https://github.com/andreassolberg/jso)
    - Javascript OAuth Library

## Available Resources
[rss.xml](http://maltretieren.github.io/rss.xml)
[atom.xml](http://maltretieren.github.io/atom.xml)
[postsFrontpage.json](http://maltretieren.github.io/rss.xml)

## License

[MIT](http://opensource.org/licenses/MIT)
