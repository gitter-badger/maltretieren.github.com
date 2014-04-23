"use strict";

/*
 * Services can be defined as : "value", "service", "factory", "provider", or "constant".
 *
 * For simplicity only example of "value" and "service" are shown here. 
 */

// EXAMPLE OF CORRECT DECLARATION OF SERVICE AS A VALUE
myApp.value('version', '0.1');

myApp.service("GithubAuthService", function ($http, $q) {
	return {
		instance : function() {
			var github = null;
			// this should ask for the UserModel - user object, and get the token from there...
			// maybe store the instance in localStorage????
			var oauthToken = localStorage.getItem("oauthToken");
			if(oauthToken != "undefined" && oauthToken != null) {
				//console.log("oauthToken is available");
				github = new Octokit({
					token: oauthToken,
					auth: "oauth"
				});
				// test the token, if it is still valid... if not,
			} else {
				console.log("oauthToken is not available or not valid");
				console.log("Did you login via github? Otherwise you can connect via Basic Authentication... Please provide a username and password...")
				this.requestToken();
			}
			return github;
		},
		requestCode: function() {
			console.log("Request a new token, the page will be reloaded with code appended to the address...");
			// request a token, this generates a state random string, the string has to be validated after login
			jso_configure({
				"github": {
                    client_id: "e5923f3d7f1182fe886f",
                    redirect_uri: "http://maltretieren.github.com",
                    authorization: "https://github.com/login/oauth/authorize?scope=public_repo"
				}
			});
	
			$.oajax({
				jso_provider: "github",
				jso_allowia: true
			});
		},
        requestToken: function(oauthCode) {
            var that = this;
            return $http({method: 'GET', url: config.heroku.authenticate+""+oauthCode}).
                success(function(data, status, headers, config) {
                    if(typeof data.token != 'undefined') {
                        console.log("Yaayy, got a token: "+data.token);
                        localStorage.setItem("oauthToken", data.token);
                        //that.userInfo().user();
                    } else {
                        console.log("It was not possible to get a token with the provided code");

                    }
                }).
                error(function(data, status, headers, config) {
                    alert("Error while getting a token for the provided code");
            });
        }
    }
});

myApp.service("GithubSrvc", function (
    $rootScope, $q, $interval, GithubAuthService,
    UserModel, PollingSrvc, ParameterSrvc, $http, $timeout) {

    return {
        // there are different states: token & code provided, token or code, nothing
        helloGithub : function(oauthCode, oauthToken) {
            var self = this;
            var oauthCode = ParameterSrvc.urlParams['code'];
            var oauthToken = localStorage.getItem("oauthToken");

            console.log("Token: "+oauthToken);
            console.log("Code: "+oauthCode);

            if(typeof oauthToken != 'undefined' && oauthToken != null && oauthToken != 'undefined') {
                console.log("Token provided, try to use it - Token: "+oauthToken)
                var userPromise = self.userInfo().user();
                userPromise.then(function() {
                    var promise = self.testAdmin();
                    promise.then(function() {
                        console.log("user is admin");
                        UserModel.setIsAdmin(true);
                    }, function(reason) {
                        console.log("user is not an admin");
                        UserModel.setIsAdmin(false);
                    })
                });
            } else if(typeof oauthCode === 'undefined' && (typeof oauthToken === 'undefined' || oauthToken === "undefined" || oauthToken === null) ) {
                console.log("nothing (no code, no token) provided, wait until user presses login button");
                // after page reload code is available and it will requestToken()
            } else if(typeof oauthCode != "undefined" && (oauthToken != 'undefined' || oauthToken != null)) {
                console.log("Code provided, no Token, request token - Code: "+oauthCode)
                GithubAuthService.requestToken(oauthCode);
            } else {
                console.log("There is something wrong with the login");
            }
        },
        requestCode: function() {
            GithubAuthService.requestCode();
        },
        userInfo: function() {
            var self = this;
            var user = function() {
                var githubInstance = GithubAuthService.instance();
                var user = githubInstance.getUser();

                var userPromise = user.getInfo().then(function(res) {
                    console.log("login successfull: "+res.login);
                    //UserModel.login(res)

                }, function(err) {
                    console.log("there was an error getting user information, maybe the token is invalid?");
                    // delete the token from localStorage, because it is invalid...
                    GithubAuthService.requestToken();
                });

                return userPromise;
            };

            return {
                user: function() { return user(); },
                logout: function() { return UserModel.logout(); }
            }
        },
        testAdmin: function() {
            var deferred = $q.defer();
            var githubInstance = GithubAuthService.instance();
            var repo = githubInstance.getRepo("Maltretieren", "maltretieren.github.com");
            var branch = repo.getBranch("master");
            var promise = this.commit("test", "test", branch);
            promise.then(function() {
                console.log("testAdming: success");
                deferred.resolve();
            }, function(reason) {
                console.log("testAdmin: errrrorrr");
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
				forkName = "flamed0011.github.com"
			}
			
            var that = this;
            var patch = {
                name: forkName
            };
            var githubInstance = GithubAuthService.instance();
            //var userName = UserModel.getUser().name;
            var repo = githubInstance.getRepo("flamed0011", config.github.repository);
            return $q.when(repo.updateInfo(patch)).then(function(res) {
                console.log("Repository renamed...")
                //that.renameBranch(forkName, "heads/master");
            })
        },
        batchDelete: function(forkName) {
            var githubInstance = GithubAuthService.instance();
            var repo = githubInstance.getRepo("flamed0011", forkName);
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
			var repo = githubInstance.getRepo("flamed0011", forkName);			
			return repo.git.deleteRef(branchName).then(function(result) {
				console.log("deleted branch"+branchName);
				//that.renameBranch(forkName);
			});
        },
        renameBranch: function(forkName) {
			var that = this;
			var githubInstance = GithubAuthService.instance();
			var repo = githubInstance.getRepo("flamed0011", forkName);			
			return repo.git.deleteRef("heads/master").then(function(result) {
				console.log("deleted master branch");
				//that.createBranch(forkName, "master");
			});
        },
        createBranch: function(forkName, branchName) {
			var that = this;
			var githubInstance = GithubAuthService.instance();
			var repo = githubInstance.getRepo("flamed0011", forkName);
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
        postProcess: function(path, replace) {
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
                var repo = githubInstance.getRepo(UserModel.user.name, UserModel.user.name+".github.com");
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
		commit: function(text, path, branch) {
            var contents = {};
            contents[path] = text;
            var deferred = $q.defer();

            branch.writeMany(contents, 'Save from GUI').then(function() {
                console.log("saved");
                deferred.resolve();
                $rootScope.$broadcast('Toast::githubCommitSuccess');
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
        },
		goodByeGithub : function() {
			UserModel.logout();
		}
    }
});

// Inspired by http://joelhooks.com/blog/2013/04/24/modeling-data-and-state-in-your-angularjs-application/
myApp.service("UserModel", function ($rootScope, ParameterSrvc, GithubAuthService) {
	this.user = {
        name: "",
        token: "",
        mail: "",
        repository: "",
        isAdmin: false
    };

    // promise1 = token
    // promise2 = isAdminTest
    // if promise1 & promise2 -> save in JSON.stringify(user) in localStorage

    this.getLoggedInUser = function() {
        var userObject = localStorage.getItem("user");
        console.log("login: userObject ="+userObject);
        if(userObject==null) {
            console.log("login: no user object in local storage")
            return null;
        } else {
            console.log("login: "+userObject);
            return userObject;
        }
    }

    this.login = function() {
        GithubAuthService.requestCode();
    }
	this.getUser = function(loginData) {
        var oauthCode = ParameterSrvc.urlParams['code'];

        if(typeof oauthCode !== 'undefined') {
            console.log("login: code provided, request token");
            var oauthCodePromise = GithubAuthService.requestToken(oauthCode);
            oauthCodePromise.then(function(res) {
               console.log("login: token="+res.token);
            });
            return null;
        } else {
            console.log("login: code not provided, wait for the user to press login");
            return null;
        }


        // test if the user logged in before

        // check, if there is a user object in localStorage
        //      -> if yes, get from localStorage and return this object with broadcast
        //      -> if no, is there a code in url?
        //          -> if no, request oauth workflo
        //          -> if yes, request the token with the url
        //
		this.user.name = loginData.login;
		console.log("send a userLoggedIn event for user: "+loginData.login);
		$rootScope.$broadcast('UserModel::userLoggedIn', loginData.login);
	};
    this.setIsAdmin = function(isAdmin) {
        this.user.isAdmin = isAdmin;
    },
	this.logout = function() {
		this.user = {};
		localStorage.clear();
		console.log("send a userLoggedOut event");
		$rootScope.$broadcast('UserModel::userLoggedOut');
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

myApp.service("PollingSrvc", function ($q, $timeout, GithubAuthService) {

	
    var poll = function (repoName, branchName) {
        var resource = "README.md";
        var deferred = $q.defer();
        // poll for availability - implement as promise, resolve as soon as it is available
		var githubInstance = GithubAuthService.instance();
		var repo = githubInstance.getRepo("flamed0011", repoName);
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

    var poll = function (repoName, branchName) {
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
                $timeout(pollForImage, 50000);
            }
            img.src = "https://flamed0011.github.com/app/img/ping.gif";
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