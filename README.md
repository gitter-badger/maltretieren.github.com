# Introduction

As soon as I discovered Jekyll on GitHub I'm keen to push the technology of this blog forward.
Starting with Jekyll Bootstrap I enhanced it with many different features... See it running on
https://maltretieren.github.io . I will provide you method to fork and run thie piece of software
on your own repository - without the need to install even git on your local computer. Login with 
your Github account on https://maltretieren.github.io and then choose "Fork". That's it. After
some minutes your own blog is running in your repository!!! Try it...

## Philosophy
Jekyll Bootstrap states: "The Quickest Way to Blog on GitHub Pages". I'm hoping to provide the
"Quickest and Easiest Way to Blog on Github Pages", because you don't even need to have any
software installed on your computer. You only need an GitHub account. You visit maltretieren.github.io
and "Login with GitHub" - Click on "fork". That's it! You have your own instance running on your github
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

## Directory Layout
Inspired by https://github.com/angular/angular-seed & https://github.com/plusjade/jekyll-bootstrap/

    _drafts                  --> blog posts, not published yet
    _includes                --> Jekyll includes
    _layouts                 --> Jekyll templates for different pages
    _plugins                 --> Only a Debug plugin, nothing else...
    _posts                   --> blog posts, sorted in subfolders
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
- login with your github account / click on "Fork"
- Wait until you get feedback that your site is available...

### Enbable advanced features
#### Comments and Rating
- Register on keen.io to get comments & rating
- Adjust config with your keen details (for now the settings are stored inside the files)
- Goto xyz.github.io and provide your settings

#### Login with github
- If you want to use "Login with GitHub" you need to install Gatekeeper on e.g. heroku (register and deploy gatekeeper)

## Software Stack
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
	- Has itself dependencies to underscore.js and base64.js
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

### External Services
- [GitHub](https://github.com/)
    - you know it...
- [Keen.io](https://keen.io)
    - Cloud database (build for analytics)
- [Heroku](https://dashboard.heroku.com)
    - Hosting of nodejs apps

## License

[MIT](http://opensource.org/licenses/MIT)
