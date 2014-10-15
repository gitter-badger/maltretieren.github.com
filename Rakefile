# This RAKEFILE should generate the template branch out of the master branch....

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
	  status = system("git push origin --delete template")
	  puts status ? "Success" : "Failed"
	  puts "\n## Creating new template branch and switching to it"
	  status = system("git checkout -b template")
	  puts status ? "Success" : "Failed"
	  puts "\n## Remove _posts directory"
	  status = system("git filter-branch --tree-filter 'rm -rf _posts' HEAD")
	  puts status ? "Success" : "Failed"
	  puts "\n## Restore _posts/templates folder"
	  status = system("--index-filter 'git rm --cached -qr -- . && git reset -q $GIT_COMMIT -- _posts/templates'")
	  puts status ? "Success" : "Failed"
	  puts "\n## Pushing template branches to origin"
	  status = system("git push origin template")
	  puts status ? "Success" : "Failed"
	end
end

task :default => ["my_tasks:generate", "my_tasks:deploy"]