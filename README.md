# Introduction

As soon as I discovered Jekyll on GitHub I'm keen to push the technology of this blog forward.
Starting with Jekyll Bootstrap I enhanced it with many different features...

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

## Directory Structure
- Inspired by https://github.com/angular/angular-seed & https://github.com/plusjade/jekyll-bootstrap/


  _drafts                  --> blog posts, not published yet
  _includes                --> Jekyll includes
  _layouts                 --> ???
  _plugins                 --> ???
  _posts                   --> blog posts, sorted in subfolders
  assets                   --> files inside this dir can be referenced from your webapp
    geojson/               --> GeoJSON files (from OpenStreetMap)
    images/                --> Images used in blog posts & yED files
    js/                    --> own Javascript files & Libraries
      angular			   --> AngularJS
      angular-app          --> Controllers, Routes, Directives...
      templates/           --> partials loaded with angularjs
      themes/              --> Bootstrap & Syntax files
        bootstrap-3.1.1    --> Bootstrap 3
        patterns           --> 
        syntax             --> CSS for syntax highlighting
			

## Setup
- gitclone my repository
- Setup a github page
- Register on keen.io to get comments & rating
- Adjust config with your keen details (for now the settings are stored inside the files)
- Push to your github page

## License

[MIT](http://opensource.org/licenses/MIT)
