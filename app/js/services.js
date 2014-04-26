"use strict";

/*
 * Services can be defined as : "value", "service", "factory", "provider", or "constant".
 *
 * For simplicity only example of "value" and "service" are shown here. 
 */

// EXAMPLE OF CORRECT DECLARATION OF SERVICE AS A VALUE
myApp.value('version', '0.1');

myApp.service("GithubAuthService", function ($http, $q, $rootScope, UserModel) {
    var github = null;

    return {
		instance : function(username, password) {
			// this should ask for the UserModel - user object, and get the token from there...
			// maybe store the instance in localStorage????
            if(github===null) {
                var oauthToken = localStorage.getItem("oauthToken");

                // search for info in localStorage
                if(typeof username === 'undefined' && typeof password === 'undefined') {
                    username = UserModel.getUser().name;
                    password = UserModel.getUser().password;
                    console.log("localStorage - Username: "+username);
                }

                if(typeof username !== 'undefined' && typeof password !== 'undefined') {
                    console.log("using username/password workflow")
                    github = new Octokit({
                        username: username,
                        password: password,
                        auth: "basic"
                    });
                } else if(oauthToken != "undefined" && oauthToken != null) {
                    console.log("using oath workflow");
                    github = new Octokit({
                        token: oauthToken,
                        auth: "oauth"
                    });
                    return github;
                } else {
                    console.log("oauthToken is not available or not valid");
                    console.log("Did you login via github? Otherwise you can connect via Basic Authentication... Please provide a username and password...")
                }
            } else {
                console.log("service already instanciated")
                return github;
            }
		},
		requestCode: function() {
			console.log("Request a new token, the page will be reloaded with code appended to the address...");
			// request a token, this generates a state random string, the string has to be validated after login
			jso_configure({
				"github": {
                    client_id: config.github.client_id,
                    redirect_uri: config.github.redirection_url,
                    authorization: config.github.authorization
				}
			});
	
			$.oajax({
				jso_provider: "github",
				jso_allowia: true
			});
		},
        requestToken: function(oauthCode) {
            var that = this;
			var tokenPromise = $q.defer();
			
            $http({method: 'GET', url: config.heroku.authenticate+""+oauthCode}).
                success(function(data, status, headers, config) {
                    if(typeof data.token != 'undefined') {
                        console.log("Yaayy, got a token: "+data.token);
                        localStorage.setItem("oauthToken", data.token);
						tokenPromise.resolve();                        
                    } else {
                        console.log("It was not possible to get a token with the provided code");
						tokenPromise.reject();
                    }
                }).
                error(function(data, status, headers, config) {
                    alert("Error while getting a token for the provided code");
            });
			
			return tokenPromise.promise;
        },
        userInfo: function() {
            var self = this;
            var user = function() {
                var githubInstance = self.instance();
                var user = githubInstance.getUser();

                var userPromise = user.getInfo().then(function(res) {
                    console.log("login successfull: "+res.login);
                    UserModel.setUserName(res.login)

                }, function(err) {
                    console.log("there was an error getting user information, maybe the token is invalid?");
                    // delete the token from localStorage, because it is invalid...
                    //GithubAuthService.requestToken();
                    //GithubModalCtrl.cancel();
                    $rootScope.$broadcast('Toast::githubLoginFail');
                });

                return userPromise;
            };

            return {
                user: function() { return user(); },
                logout: function() { return UserModel.logout(); }
            }
        }
    }
});

myApp.service("GithubSrvc", function (
    $rootScope, $q, $interval, GithubAuthService,
    UserModel, PollingSrvc, ParameterSrvc, $http, $timeout) {

    return {
        requestCode: function() {
            GithubAuthService.requestCode();
        },
        testAdmin: function() {
            var deferred = $q.defer();
            var githubInstance = GithubAuthService.instance();
            var repo = githubInstance.getRepo(config.github.user, config.github.repository);
            var branch = repo.getBranch("master");
            var promise = this.commit("test", "test", branch);
            promise.then(function() {
                console.log("testAdming: success");
				UserModel.setIsAdmin(true);
                deferred.resolve();
            }, function(reason) {
                console.log("testAdmin: errrrorrr");
				UserModel.setIsAdmin(false);
                deferred.reject();
            })
            return deferred.promise;
        },
		fork: function(options) {
            // options contain the name for the new github page and the site slogan
			var githubInstance = GithubAuthService.instance();
			if(githubInstance != null) {
                // this is the name of the original repo
                var repo = githubInstance.getRepo(config.github.user, config.github.repository);
                var promise = $q.when(repo.fork());
                return promise;
            } else {
                console.log("no token provided... Please login");
            }
		},
        renameRepo: function(forkName) {
			console.log("rename repo to "+forkName);
            if(!forkName || forkName.length < 5){
				forkName = UserModel.getUser().name+".github.com"
			}
			
            var that = this;
            var patch = {
                name: forkName
            };
            var githubInstance = GithubAuthService.instance();
            //var userName = UserModel.getUser().name;
            var repo = githubInstance.getRepo(UserModel.getUser().name, config.github.repository);
            return $q.when(repo.updateInfo(patch)).then(function(res) {
                console.log("Repository renamed...")
                //that.renameBranch(forkName, "heads/master");
            })
        },
        batchDelete: function(forkName) {
            var githubInstance = GithubAuthService.instance();
            var repo = githubInstance.getRepo(UserModel.getUser().name, forkName);
            var branch = repo.getBranch("master");

			// polling for the posts dir every second until rename complete,
			// then start delete every second....
			(function tick(path) {
				$q.when(branch.contents(path)).then(function(res) {
					console.log("cleanup of _posts...");
					var i = 0;
					$interval(function() {
						if(res[i].type === "file") {
							branch.remove(res[i].path, "deleted");
						} else {
							console.log(res[i].path + " is a folder - delete the content instead");
							tick(res[i].path);
						}
						i++;
					}, 1500, res.length);
				}, function(err) {
					$timeout(tick("_posts"), 1000);
				});
			})();

        },
        deleteBranch: function(forkName, branchName) {
			var that = this;
			var githubInstance = GithubAuthService.instance();
			var repo = githubInstance.getRepo(UserModel.getUser().name, forkName);
			return repo.git.deleteRef(branchName).then(function(result) {
				console.log("deleted branch"+branchName);
				//that.renameBranch(forkName);
			});
        },
        renameBranch: function(forkName) {
			var that = this;
			var githubInstance = GithubAuthService.instance();
			var repo = githubInstance.getRepo(UserModel.getUser().name, forkName);
			return repo.git.deleteRef("heads/master").then(function(result) {
				console.log("deleted master branch");
				//that.createBranch(forkName, "master");
			});
        },
        createBranch: function(forkName, branchName) {
			var that = this;
			var githubInstance = GithubAuthService.instance();
			var repo = githubInstance.getRepo(UserModel.getUser().name, forkName);
			console.log("switch to template branche");
			var branch = repo.getBranch("template");
			var forkName = forkName;
			console.log("create master branch from template");
			return branch.createBranch("master").then(function() {
				console.log("master branch created from template branch");
                branch = repo.getBranch("master");
                var callback = function() {
                    //repo.git.deleteRef("heads/template");
                };
                //PollingSrvc.checkForBranchContent(branch, "README.md", callback);
			});
        },
        postProcess: function(path, replace, repositoryName) {
            // change page slogan:
            // request _config.yml
            // search/replace "title : Place to pee free!"/"title: slogan)
            // commit
            var self = this;
            var content = this.getContent(path);
            var deferred = $q.defer();
            content.then(function(data) {
                var configLine = data.content.split('\n');
                var newConfigData = "";
                for(var i = 0;i < configLine.length;i++){
                    var split = configLine[i].split(":");
                    var replaceKey = split[0].trim();
                    var replaceHit = replace[replaceKey];
                    if(typeof replaceHit != 'undefined') {
                       console.log("HITTTTTT")
                       newConfigData += split[0]+": "+replaceHit+"\n";
                    } else {
                       newConfigData += configLine[i]+"\n";
                    }
                }
                //console.log(newConfigData);
                var githubInstance = GithubAuthService.instance();
                var repo = githubInstance.getRepo(UserModel.getUser().name, repositoryName);
                var branch = repo.getBranch("master");
                var commitPromise = self.commit(newConfigData, path, branch);
                commitPromise.then(function() {
                    deferred.resolve(newConfigData);
                });
            });
            return deferred.promise;
        },
        getContent: function(path) {
            var githubInstance = GithubAuthService.instance();
            var repo = githubInstance.getRepo(config.github.user, config.github.repository);

            //console.log(path);
            var branch = repo.getBranch("master");
            var contents = branch.read(path, false)
            var deferred = $q.defer();
            contents.then(function(result) {
               deferred.resolve(result);
            })
            return deferred.promise;
        },
        editContent: function(path) {
            var self = this;
            var path = path;
            var githubInstance = GithubAuthService.instance();
            var repo = githubInstance.getRepo(config.github.user, config.github.repository);

            //console.log(path);
            var branch = repo.getBranch("master");
            var contents = branch.read(path, false)
            var deferred = $q.defer();
            contents.then(function(result) {
                //console.log(result.content);
                $('#target-editor').markdown({
                    savable:true,
                    height:500,
                    onSave: function(e) {
                        //self.commit(e.getContent(), path)
                        deferred.resolve(e.getContent());
                    }
                });
                $('#target-editor').show();
                $("#target-editor").val(result.content);
            })
            return deferred.promise;
        },
		commit: function(text, path, branch, showMessage) {
			if(typeof branch === 'undefined') {
				var githubInstance = GithubAuthService.instance();
				var repo = githubInstance.getRepo(config.github.user, config.github.repository);
				branch = repo.getBranch("master");
			}
			var contents = {};
            contents[path] = text;
            var deferred = $q.defer();

            branch.writeMany(contents, 'Save from GUI').then(function() {
                deferred.resolve();
				if(showMessage) {
					$rootScope.$broadcast('Toast::githubCommitSuccess');
				}
            }, function(error) {
                console.log("there was a commit error");
                deferred.reject();
            });
            return deferred.promise;
        },
        deleteContent: function(path) {
            var githubInstance = GithubAuthService.instance();
            var repo = githubInstance.getRepo(config.github.user, config.github.repository);
            var branch = repo.getBranch("master");

            branch.remove(path, 'Deleted Post from GUI').then(function() {
                console.log("deleted");
                $rootScope.$broadcast('Toast::githubDeleteSuccess');
            });
        }
    }
});

// Inspired by http://joelhooks.com/blog/2013/04/24/modeling-data-and-state-in-your-angularjs-application/
myApp.service("UserModel", function ($rootScope) {
	this.user = {};
    var serializeUser = function(user) {
        var userJson = JSON.stringify(user);
        localStorage.setItem("user", userJson);
    }

	this.setUserName = function(userName) {
		this.user.name = userName;
        serializeUser(this.user);
	};
    this.setIsAdmin = function(isAdmin) {
        this.user.isAdmin = isAdmin;
        serializeUser(this.user);
    },
    this.setPassword = function(password) {
        this.user.password = password;
        serializeUser(this.user);
    },
	this.logout = function() {
		this.user = {};
		localStorage.clear();
		$rootScope.$broadcast('UserModel::userLoggedOut');
	}
	this.getUser = function() {
		var userString = localStorage.getItem("user");
		if(typeof userString !== 'undefined') {
			var userObject = JSON.parse(userString);
			return userObject;
		} else {
			return null;
		}
	}
});

/**
 This is a helper function
 **/
myApp.service("ParameterSrvc", function ($window) {
    var urlParams;
    ($window.onpopstate = function () {
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
    })();
    return {
        urlParams: urlParams
    }
});

myApp.service("PollingSrvc", function ($q, $timeout, UserModel, GithubAuthService) {
        var poll = function (repoName, branchName) {
        var resource = "README.md";
        var deferred = $q.defer();
        // poll for availability - implement as promise, resolve as soon as it is available
		var githubInstance = GithubAuthService.instance();
		var repo = githubInstance.getRepo(UserModel.getUser().name, repoName);
		var branch = repo.getBranch(branchName);
		var repoName = repoName;
		var branchName = branchName;
		
		var restartPolling = function() {
		    var promise = branch.read(resource,false);
			promise.then(function(res) {
				console.log("branch available")
				deferred.resolve();
			}, function(err) {
				var restart = function(){
					restartPolling(repoName, branchName)
				}
				$timeout(restart, 2000);
			});
		}
		restartPolling();

        return deferred.promise;
    };
    return { checkForBranchContent: poll }
});

myApp.service("PollingImgSrvc", function ($q, $timeout) {

    var poll = function (repoName) {
        var deferred = $q.defer();

        var pollForImg = function() {
            console.log("poll");
            var img = new Image();

            img.onload = function() {
                console.log("yehh");
                deferred.resolve();
            }
            img.onerror = function() {
                console.log("oh noooo");
                var pollForImage = function() {
                    pollForImg();
                }
                $timeout(pollForImage, 30000);
            }
            img.src = "https://"+repoName+"/app/img/ping.gif";
        }
        pollForImg();

        return deferred.promise;
    };
    return { checkReady: poll }
});

myApp.service("StyleSwitcher", function () {
	return { switch: function(styleName) {
		console.log("switch to style: "+styleName);
		if(typeof styleName!=='undefined' && styleName !== '') {
			var i, link_tag ;
			  for (i = 0, link_tag = document.getElementsByTagName("link") ;
				i < link_tag.length ; i++ ) {
				if ((link_tag[i].rel.indexOf( "stylesheet" ) != -1) &&
				  link_tag[i].title) {
				  link_tag[i].disabled = true ;
				  if (link_tag[i].title == styleName) {
					link_tag[i].disabled = false ;
				  }
				}
			  }
		}
	}}
});