# This RAKEFILE should generate the template branch out of the master branch....

require "rubygems"
require "tmpdir"

require "bundler/setup"
require "jekyll"
require "fileutils"
require "rake/clean"


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
      file_list = FileList.new('_posts/**/*').exclude('_posts/templates', '_posts/templates/*')
	  #rm_f file_list
      Dir.glob(file_list) do |my_text_file|
		if File.file?(my_text_file)
		  #puts "deleting file: #{my_text_file}..."
		  FileUtils.rm(my_text_file)
		elsif File.directory?(my_text_file)
		  #puts "deleting folder: #{my_text_file}..."
		  #FileUtils..rm_rf(my_text_file)
        end
      end
	  puts "\n## Pushing template branches to origin"
	  system("git add . -A")
	  system("git commit -m 'prepare for template'")
	  status = system("git push origin template")
	  puts status ? "Success" : "Failed"
	end
end

task :default => ["my_tasks:generate", "my_tasks:deploy"]