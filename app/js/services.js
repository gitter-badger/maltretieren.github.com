"use strict";

/*
 * Services can be defined as : "value", "service", "factory", "provider", or "constant".
 *
 * For simplicity only example of "value" and "service" are shown here. 
 */

// EXAMPLE OF CORRECT DECLARATION OF SERVICE AS A VALUE
myApp.value('version', '0.1');

myApp.service("GithubAuthService", function ($http, UserModel) {
	return {
        self: function() {
            success =function() {
                alert("success");
            },
            error = function() {
                alert("error");
            }
            return { success: success(), error: error() }
        },
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
        requestToken: function(oauthCode, callback) {
            $http({method: 'GET', url: 'https://maltretieren.herokuapp.com/authenticate/'+oauthCode}).
                success(self.success).error(self.error)
        },
		isTokenValid: function(token) {
			console.log("Test if the token is still valid...");
		},
		clearLocalStorage: function() {
			// tokens are stored in local storage
			localStorage.clear();
		},
        userInfo: function() {
            var self = this;
            var user = function() {
                var githubInstance = self.instance();
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
        },
    }
});

myApp.service("GithubSrvc", function (GithubAuthService, UserModel, ParameterSrvc, $http) {
    var self = this;

    return {
        // there are different states: token & code provided, token or code, nothing
        helloGithub : function(oauthCode, oauthToken) {
            var oauthCode = ParameterSrvc.urlParams['code'];
            var oauthToken = localStorage.getItem("oauthToken");

            console.log("Token: "+oauthToken);
            console.log("Code: "+oauthCode);

			if(typeof oauthCode === 'undefined' && (typeof oauthToken === 'undefined' || oauthToken === "undefined" || oauthToken === null) ) {
				console.log("nothing (no code, no token) provided, redirect to github to grant permissions and after reloading there should be the code");
                GithubAuthService.requestCode();
                // after page reload code is available and it will requestToken()
			} else if(typeof oauthToken != 'undefined' && oauthToken != null && oauthToken != 'undefined') {
				console.log("Token provided, try to use it - Token: "+oauthToken)
                GithubAuthService.userInfo().user();
			} else if(typeof oauthCode != "undefined" && (oauthToken != 'undefined' || oauthToken != null)) {
				console.log("Code provided, no Token, request token - Code: "+oauthCode)
                GithubAuthService.requestToken(oauthCode);
			} else {
				console.log("There is something wrong with the login");
			}
        },
		goodByeGithub : function() {
			UserModel.logout();
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