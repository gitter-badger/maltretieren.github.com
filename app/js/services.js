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

myApp.service("GithubUserService", function (GithubAuthService, UserModel) {
	return {
		user : function() {
		    var githubInstance = GithubAuthService.instance();
        	var user = githubInstance.getUser();
            user.show('', function(err, res) {
				if(err) {
					console.log("there was an error getting user information");
				} else {
				    console.log("login successfull: "+res.login);
					UserModel.login(res.login);
				}
            });
        },
		isAdmin : function() {
			console.log("isAdmin? : true");
		}
    }
});

myApp.service("GithubAuthService", function () {
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
				// test the token, if it is still valid... if not, 

			} else {
				console.log("oauthToken is not available or not valid");
				alert("Did you login via github? Otherwise you can connect via Basic Authentication... Please provide a username and password...")
				this.requestToken();
			}
			return github;
		},
		requestToken: function() {
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
		isTokenValid: function(token) {
			console.log("Test if the token is still valid...");
		}
    }
});

myApp.service("GithubSrvc", function (GithubUserService, GithubAuthService) {
    return {
        helloGithub : function() {
        	var userName = GithubUserService.user();
			return userName;
        }
    }
	
	// the service should be responsible for
	// - check if a token is available
	// - if a token is available get user information
	// - update "Login with github" to match the username
	// - try a commit to the repository
	// - if the commit is successfull it's the admin user
	// - else it's a guest user
});

// Inspired by http://joelhooks.com/blog/2013/04/24/modeling-data-and-state-in-your-angularjs-application/
myApp.service("UserModel", function ($rootScope) {
	this.user = {}
	this.loggedIn = false;
	this.login = function(userName) {
		this.loggedIn = true;
		this.user = {
			name: userName
		}
		console.log("send a userLoggedIn event for user: "+userName);
		$rootScope.$broadcast('UserModel::userLoggedIn', userName);
	}
});