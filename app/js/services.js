"use strict";

/*
 * Services can be defined as : "value", "service", "factory", "provider", or "constant".
 *
 * For simplicity only example of "value" and "service" are shown here. 
 */

// EXAMPLE OF CORRECT DECLARATION OF SERVICE AS A VALUE
myApp.value('version', '0.1');

myApp.service("GithubAuthService", function ($http, $q, UserModel) {
	return {
		instance : function() {
			var github = null;
			// this should ask for the UserModel - user object, and get the token from there...
			// maybe store the instance in localStorage????
			var oauthToken = localStorage.getItem("oauthToken");
			if(oauthToken != "undefined" && oauthToken != null) {
				console.log("oauthToken is available");
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
            $http({method: 'GET', url: 'https://maltretieren.herokuapp.com/authenticate/'+oauthCode}).
                success(function(data, status, headers, config) {
                    if(typeof data.token != 'undefined') {
                        console.log("Yaayy, got a token: "+data.token);
                        localStorage.setItem("oauthToken", data.token);
                        that.userInfo().user();
                    } else {
                        console.log("It was not possible to get a token with the provided code");

                    }
                }).
                error(function(data, status, headers, config) {
                    alert("Error while getting a token for the provided code");
            });
        },
        userInfo: function() {
            var self = this;
            var user = function() {
                var githubInstance = self.instance();
                var user = githubInstance.getUser();
                $q.when(user.getInfo()).then(function(res) {
                    console.log("login successfull: "+res.login);
                    UserModel.login(res.login);
                }, function(err) {
                    console.log("there was an error getting user information, maybe the token is invalid?");
                    // delete the token from localStorage, because it is invalid...
                    GithubAuthService.requestToken();
                });
            };

            return {
                user: function() { return user(); },
                logout: function() { return UserModel.logout(); }
            }
        }
    }
});

myApp.service("GithubSrvc", function ($rootScope, $q, GithubAuthService, UserModel, ParameterSrvc, $http, $timeout) {
    return {
        // there are different states: token & code provided, token or code, nothing
        helloGithub : function(oauthCode, oauthToken) {
            var oauthCode = ParameterSrvc.urlParams['code'];
            var oauthToken = localStorage.getItem("oauthToken");

            console.log("Token: "+oauthToken);
            console.log("Code: "+oauthCode);

            if(typeof oauthToken != 'undefined' && oauthToken != null && oauthToken != 'undefined') {
                console.log("Token provided, try to use it - Token: "+oauthToken)
                GithubAuthService.userInfo().user();
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
		fork: function() {
			var githubInstance = GithubAuthService.instance();
			if(githubInstance != null) {
                var repo = githubInstance.getRepo("Maltretieren", "maltretieren.github.com");
                $q.when(repo.fork()).then(function(res) {
                    console.log("send a githubForkSuccess event");
                    $rootScope.$broadcast('Toast::githubForkSuccess');
                });
               // poll for content
               // http://stackoverflow.com/questions/4777535/how-do-i-rename-a-github-repository-via-their-api
                repo = githubInstance.getRepo("flamed0011", "maltretieren.github.com");
                var branch = repo.getBranch("master");
                var that = this;
                (function tick() {
                    $q.when(branch.read("README.md",false)).then(function(res) {
                        that.patch();
                    }, function(err) {
                        $timeout(tick, 5000);
                    });
                })();

            } else {
                console.log("no token provided... Please login");
            }
		},
        patch: function() {
            var that = this;
            var patch = {
                name: "flamed0011.github.com"
            };
            var githubInstance = GithubAuthService.instance();
            var repo = githubInstance.getRepo("flamed0011", "maltretieren.github.com");
            $q.when(repo.updateInfo(patch)).then(function(res) {
                console.log("Repository renamed...")
                that.clear();
            })
        },
        clear: function() {
            var githubInstance = GithubAuthService.instance();
            var repo = githubInstance.getRepo("flamed0011", "flamed0011.github.com");
            var branch = repo.getBranch("master");

			var content = {}
            $q.when(branch.contents("_posts")).then(function(res) {
					console.log("cleanup of _posts...");
					for(var i=0; i<3; i++) {
						content[res[i].path] = "haalloo";
					}
				}, function(err) {
					console.log("err"+err);
				}
			).then(function() {
				$q.when(branch.writeMany(content, "deleted")).then(function(response) {
					console.log(content);
					console.log(response)
				}, function(error) {
					console.log("eerrrror while writng");
				})
			});
        },
		commit: function(text, path) {
            var githubInstance = GithubAuthService.instance();
			var repo = githubInstance.getRepo("Maltretieren", "maltretieren.github.com");
			repo.write("master", path, text, "Updated config.js from GUI", function(err) {
				var url = $('#url').text()+"?success=true";
				if(err) {
					alert("Maybe you are not the owner of this repo - you can try to commit a pull request...")
				} else {
					//window.location = url;
					console.log("send a githubCommitSuccess event");
					$rootScope.$broadcast('Toast::githubCommitSuccess');
				}
			});
        },
		goodByeGithub : function() {
			UserModel.logout();
		}
    }
});

// Inspired by http://joelhooks.com/blog/2013/04/24/modeling-data-and-state-in-your-angularjs-application/
myApp.service("UserModel", function ($rootScope) {
	this.user = {};
	this.isAdmin = false;
	this.token = "";
	
	this.login = function(userName) {
		this.loggedIn = true;
		this.user = {
			name: userName
		};
		console.log("send a userLoggedIn event for user: "+userName);
		//$rootScope.$broadcast('UserModel::userLoggedIn', userName);
	};
	this.logout = function() {
		this.user = {};
		this.loggedIn = false;
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

// EXAMPLE OF CORRECT DECLARATION OF SERVICE
// here is a declaration of simple utility function to know if an given param is a String.
myApp.service("UtilSrvc", function () {
    return {
        isAString: function(o) {
            return typeof o == "string" || (typeof o == "object" && o.constructor === String);
        },
        helloWorld : function(name) {
        	var result = "Hum, Hello you, but your name is too weird...";
        	if (this.isAString(name)) {
        		result = "Hello, " + name;
        	}
        	return result;
        }
    }
});
