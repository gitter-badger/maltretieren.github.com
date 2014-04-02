# Introduction

As soon as I discovered Jekyll on GitHub I'm keen to push the technology of this blog forward.
Starting with Jekyll Bootstrap I enhanced it with many different features... See it running on
https://maltretieren.github.io

## Philosophy
Easy to use, user friendly, cool

## Features
- Free to Fork - MIT License
- GitHub Pages compatible (uses only GitHub whitelistet plugins)
- HTTPS always (redirect to HTTPS if the user visits via HTTP)
- Edit feature (append ?edit=true to the url and see, edit, provide password and save)
- Permanent Login via GitHub oAuth2 (login once, edit everytime)
- Interactive tables build out of blog posts - beautiful, searchable, sortable
- Comments via keen.io
- Ratings via keen.io
- Nice image captions

## Directory Layout
Inspired by https://github.com/angular/angular-seed & https://github.com/plusjade/jekyll-bootstrap/

    _drafts                  --> blog posts, not published yet
    _includes                --> Jekyll includes
    _layouts                 --> ???
    _plugins                 --> ???
    _posts                   --> blog posts, sorted in subfolders
    assets                   --> 

      images/                --> Source files for graphics (yED)
      js/                    --> Libraries (not customized stuff)
        angular              --> AngularJS
        themes/              --> Bootstrap & Syntax files
          bootstrap-3.1.1    --> Bootstrap 3
          bg-patterns        --> Background textures
          syntax             --> CSS for syntax highlighting
    app                      --> Self created stuff
	    css                  --> Own CSS files
		data                 --> Static data files
		    geojson/         --> GeoJSON files (from OpenStreetMap), to be rendered on GitHub
		img                  --> Images used in blog posts & 
		js                   --> App.js, Angular Controllers, Routes, Directives...
		partials             --> Templates loaded with AngularJS
	    
			

## Setup
- gitclone my repository
- Setup a github page
- Register on keen.io to get comments & rating
- Adjust config with your keen details (for now the settings are stored inside the files)
- Push to your github page
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
