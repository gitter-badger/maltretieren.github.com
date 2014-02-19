---
layout: post
categories :
  - frontpage
  - blog
tagline: "a post to the main page"
tags : 
  - jekyll
  - github
---

{% include JB/setup %}

## Include a GeoJSON hosted on GitHub
The path to follow is to query the [OSM Overpass Turbo API](http://overpass-turbo.eu/) with the wizard e.g.
for "Trinkbrunnen" ([more details in German](http://blog.openstreetmap.de/blog/2014/01/der-turbo-fuer-die-overpass-api/))
and exported it as GeoJSON file. Then the file is saved it to the `assets/geojson/drinking_water.json` folder of my Jekyll site
and pushed to GitHub. For more details take a look at the [GitHub Help for Mapping GeoJson files on GitHub](https://help.github.com/articles/mapping-geojson-files-on-github)
This is very nice and simple!

### Howto use the map data in a Jekyll Post
Use the script tag in your Jekyll post to include the map:
{% highlight javascript %}
<script src="https://embed.github.com/view/geojson/Maltretieren/maltretieren.github.com/master/assets/geojson/drinking_water.geojson"></script>
{% endhighlight %}

### Are you thirsty?
Go to these places to find free drinking water in Munich (Dated 2014-02-17, Thanks to OpenStreetMap Contributors). It seems as the
map is not loaded properly on every page load (the widget tries to zoom to the map data extent and maybe the content is not ready yet?).

<script src="https://embed.github.com/view/geojson/Maltretieren/maltretieren.github.com/master/assets/geojson/drinking_water.geojson"></script>
