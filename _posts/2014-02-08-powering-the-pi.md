---
layout: post
categories: 
  - test
tagline: a post to the main page
tags: 
  - development
  - test
published: true
commentIssueId: 1
---

{% include JB/setup %}
test
## Syntax Highlighting
For more pygment css styles see [pygments-css](https://github.com/richleland/pygments-css) : replace .codehilite with .highlight for these to work with Jekyll
{% highlight javascript linenos=table %}
var helloWorld = "Hello Jekyll";
alert(helloWorld);
{% endhighlight %}

## Include HTML Widgets
{% include widgets/tagCloud.html %}
{% include widgets/timeLine.html %}

## Prevent Jekyll from interpreting brackets
{% raw %}
{{page.title}}
{% endraw %}

## Include GISTS
{% gist 9092977 %}

## Embed YouTube videos
<iframe width="560" height="315"  src="//www.youtube.com/embed/XK-dLdLQdIE" frameborder="0"></iframe>

## Images
![Develop local, run remote](/assets/images/DevEnvironment.png)



