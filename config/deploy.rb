# require 'mina/bundler'
# require 'mina/rails'
require 'mina/git'
require 'mina/npm'
# require 'mina/rbenv'  # for rbenv support. (http://rbenv.org)
# require 'mina/rvm'    # for rvm support. (http://rvm.io)

# Basic settings:
#   domain       - The hostname to SSH to.
#   deploy_to    - Path to deploy into.
#   repository   - Git repo to clone from. (needed by mina/git)
#   branch       - Branch name to deploy. (needed by mina/git)

set :domain, '119.254.101.242'
set :repository, 'git@github.com:xuyannan/17yin_deliverman.git'
set :keep_releases, 20

# For system-wide RVM install.
#   set :rvm_path, '/usr/local/rvm/bin/rvm'

# Manually create these paths in shared/ (eg: shared/config/database.yml) in your server.
# They will be linked in the 'deploy:link_shared_paths' step.

# Optional settings:
set :user, 'deploy'    # Username in the server to SSH to.
set :port, '22'     # SSH port number.
set :term_mode, nil

stage = ENV['to']
set :deploy_to, "/opt/deploy/#{stage}/kuai.yin17.com"

#   set :forward_agent, true     # SSH forward_agent.

# This task is the environment that is loaded for most commands, such as
# `mina deploy` or `mina rake`.
task :environment do
  case stage
    when 'test'
      set :branch, 'dev'
    when 'development'
      set :branch, 'dev'
    when 'staging'
      set :branch, 'dev'
    when 'production'
      set :branch, 'master'
    else
    print_error "Please specify a stage(development|staging|production). eg. mina deploy to=production"
    exit
  end

  # If you're using rbenv, use this to load the rbenv environment.
  # Be sure to commit your .ruby-version or .rbenv-version to your repository.
  # invoke :'rbenv:load'

  # For those using RVM, use this to load an RVM version@gemset.
  #invoke :'rvm:use[ruby-2.1.5@default]'
end

# Put any custom mkdir's in here for when `mina setup` is ran.
# For Rails apps, we'll make some of the shared paths that are shared between
# all releases.
task :setup => :environment do
  queue! %[mkdir -p "#{deploy_to}/#{shared_path}/log"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/#{shared_path}/log"]

  queue! %[mkdir -p "#{deploy_to}/#{shared_path}/node_modules"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/#{shared_path}/node_modules"]
end

desc "Deploys the current version to the server."
task :deploy_without_fis => :environment do
  deploy do
    set :shared_paths, ['src/config.js', 'log', 'node_modules']
    # Put things that will set up an empty directory into a fully set-up
    # instance of your project.
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    invoke :'npm:install --production'
    invoke :'deploy:cleanup'

    to :launch do
      # queue "mkdir -p #{deploy_to}/#{current_path}/tmp/"
      # queue "touch #{deploy_to}/#{current_path}/tmp/restart.txt"
    end
  end
end

namespace :fis do
  # ### fis:deploy
  desc "compile for deploy"
  task :deploy => :environment do
    queue %{
      echo "-----> fis deploy"
      #{echo_cmd %[bower install]}
      #{echo_cmd %[cp "#{deploy_to}/#{shared_path}/app/config.js" ./app/]}
      #{echo_cmd %[fis release -m -p -o -r ./app -d ./dist/app]}
    }
  end
end

namespace :webpack do
  desc "run webpack"
  task :deploy => :environment do
    set :shared_paths, ['src/config.js', 'log', 'node_modules']
    queue %{
      echo "-----> webpack deploy"
      #{invoke :'deploy:link_shared_paths'}
      #{echo_cmd %[cnpm install]}
      #{echo_cmd %[cnpm run build]}
    }
  end
end

desc "Deploys the current version to the server use webpack."
task :deploy => :environment do
  deploy do
    # set :shared_paths, []
    # Put things that will set up an empty directory into a fully set-up
    # instance of your project.
    invoke :'git:clone'
    invoke :'webpack:deploy'
    invoke :'deploy:cleanup'

    to :launch do
      # queue "mkdir -p #{deploy_to}/#{current_path}/tmp/"
      # queue "touch #{deploy_to}/#{current_path}/tmp/restart.txt"
    end
  end
end

# For help in making your deploy script, see the Mina documentation:
#
#  - http://nadarei.co/mina
#  - http://nadarei.co/mina/tasks
#  - http://nadarei.co/mina/settings
#  - http://nadarei.co/mina/helpers
