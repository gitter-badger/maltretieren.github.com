---

layout: post
categories: 
  - frontpage
tagline:
tags: 
  - development
  - jekyll
published: true

---

{% include JB/setup %}

# Introduction
This blogging software is simple and lacks some nice features - e.g. to upload and include pictures via the GUI. For me this is not essential because I update the blog most times on my notebook where I have an graphics program, an IDE and Git software installed. Maybe some people don't have.

It would be nice to have a page where people can vote on some features...

# ToDo
The current ToDos focus to cleanup current functionality...

* If there are no comments available, don't display comments section on the pages
* Disable comments for pages via the YAML frontmatter. Comments are enabled by default
* When a user login via github, check if he can commit to the current repository. If yes he is the admin of the site (green button, show menu entries: edit config, edit post, create post). If no, he is a normal user and propably wants to fork the site (orange button, hide menu entries: edit config, edit post, create post - shoe menu entries: fork).
* Cleanup logging
* Refactor code (clear responsibilities for controllers, services, ...)
* Cleanup user login - if the user gets to a page where a login is required ASK him what todo: login with github er stay in normal mode