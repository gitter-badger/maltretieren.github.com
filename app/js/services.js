"use strict";

/*
 * Services can be defined as : "value", "service", "factory", "provider", or "constant".
 *
 * For simplicity only example of "value" and "service" are shown here. 
 */

// EXAMPLE OF CORRECT DECLARATION OF SERVICE AS A VALUE
myApp.value('version', '0.1');

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

myApp.service("GithubAuthService", function ($http) {
	return {
		instance : function() {
			var github = null;
			var oauthToken = localStorage.getItem("oauthToken");
			if(oauthToken != "undefined" && oauthToken != null) {
				console.log("oauthToken is available");
				github = new Github({
					token: oauthToken,
					auth: "oauth"
				});
				this.isTokenValid(oauthToken);
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
			// request a token
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
        requestToken: function() {
            $http({method: 'GET', url: 'https://maltretieren.herokuapp.com/authenticate/'+oauthCode}).
                success(function(data, status, headers, config) {
                    if(typeof oauthCode != 'undefined') {
                        console.log("Yaayy, got a token:"+data.token);
                        localStorage.setItem("oauthToken", data.token);
                    } else {
                        console.log("It was not possible to get a token with the provided code");
                    }
                }).
                error(function(data, status, headers, config) {
                    alert("Error while getting a token for the provided code");
            });
        },
		isTokenValid: function(token) {
			console.log("Test if the token is still valid...");
		},
		clearLocalStorage: function() {
			// tokens are stored in local storage
			localStorage.clear();
		}
    }
});

myApp.service("GithubSrvc", function (GithubAuthService, $http) {
    return {
        // there are different states: token & code provided, token or code, nothing
        helloGithub : function(oauthCode, oauthToken) {
			if((oauthCode === 'undefined' || oauthCode === null) && (oauthToken === "undefined" || oauthToken === null)) {
				console.log("nothing (no code, no token) provided, redirect to github to grant permissions and after reloading there should be the code");
                GithubAuthService.requestCode();
                // after page reload code is available and it will requestToken()
			} else if(oauthToken != "undefined" && oauthToken != null) {
				console.log("Token provided, try to use it - Token: "+oauthToken);
				//GithubUserService.user();
			} else if(oauthCode != "undefined" && oauthCode != null) {
				console.log("Code provided, no Token, request token - Code: "+oauthCode)
                GithubAuthService.requestToken();
			} else {
				console.log("There is something wrong with the login");
			}
        },
		goodByeGithub : function() {
			GithubUserService.logout();
			console.log("Clear localStorage");
			GithubAuthService.clearLocalStorage();
		}
    }
	

	
	// the service should be responsible for
	// - check if a token is available
	// 		- if a token is available get user information
	// 		- update "Login with github" to match the username
	// 		- try a commit to the repository
	// 		- if the commit is successfull it's the admin user
	// 		- else it's a guest user
	// - if no token is available
	// 		- request a token
});

myApp.service("GithubUserService", function (GithubAuthService, UserModel) {
    var user = function() {
        var githubInstance = GithubAuthService.instance();
        var user = githubInstance.getUser();
        user.show('', function(err, res) {
            if(err) {
                console.log("there was an error getting user information, maybe the token is invalid?");
                // delete the token from localStorage, because it is invalid...
                GithubAuthService.clearLocalStorage();
                GithubAuthService.requestToken();
            } else {
                console.log("login successfull: "+res.login);
                UserModel.login(res.login);
            }
        });
    };

    return {
        user: function() { return user(); },
        logout: function() { return UserModel.logout(); }
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
		$rootScope.$broadcast('UserModel::userLoggedIn', userName);
	};
	this.logout = function() {
		this.user = {};
		this.loggedIn = false;
		console.log("send a userLoggedOut event");
		$rootScope.$broadcast('UserModel::userLoggedOut');
	}
});