require "rubygems"
require "tmpdir"

require "bundler/setup"
require "jekyll"


# Change your GitHub reponame
GITHUB_REPONAME = "Maltretieren/maltretieren.github.com"

namespace :my_tasks do
  desc "Generate blog files"
  task :generate do
    Jekyll::Site.new(Jekyll.configuration({
      "source"      => ".",
      "destination" => "_site"
    })).process
  end
  
	desc "Deploy _site/ to master branch"
	task :deploy do
	  puts "\n## Deleting template branch"
	  status = system("git branch -D template")
	  puts status ? "Success" : "Failed"
	  #puts "\n## Creating new master branch and switching to it"
	  #status = system("git checkout -b master")
	  #puts status ? "Success" : "Failed"
	  #puts "\n## Forcing the _site subdirectory to be project root"
	  #status = system("git filter-branch --subdirectory-filter _site/ -f")
	  #puts status ? "Success" : "Failed"
	  #puts "\n## Switching back to source branch"
	  #status = system("git checkout source")
	  #puts status ? "Success" : "Failed"
	  #puts "\n## Pushing all branches to origin"
	  #status = system("git push --all origin")
	  #puts status ? "Success" : "Failed"
	end
end

task :default => ["my_tasks:generate"]