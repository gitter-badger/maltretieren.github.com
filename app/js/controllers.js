'use strict';

/**
*	The controller must be responsible for binding model data to views using $scope,
 *	and control information flow.
*	It does not contain logic to fetch the data or manipulating it.
*/

/**
 * Receive a complete list of all comments
 */
myApp.controller("CommentsCtrl",function ($scope, $http) {

	var commentsUrl = "https://api.keen.io/3.0/projects/532b3e5a00111c0da1000006/queries/extraction?api_key=fca64cb411fe523d053f2d9b1d159011135be6ce55da682f1ad8d6b1d4f629b84dd564edb1c0d7a0d7575ebaaa79b55daa075f7c866d7430ace403bab51b7513aa41b30ce443f9d736d45d33c78a0b44420c2ecd35223b76d67af37df1d0cc52bf67e73cb32d949eb58cb5814e7e5e6a&event_collection=comments&timezone=3600"

    $http({method: 'GET', url: commentsUrl}).
        success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("Successfully received comments from keen.io")
            $scope.comments = {
                entries: data.result
            }
        }).
        error(function(data, status, headers, config) {
            alert("Error while getting comments from keen.io: "+status)
        });

    $scope.quantity = 5;
    $scope.sortorder = 'created_at';

    // hacky way to determine if it is the frontpage
    // -> on frontpage show all comments
    var parts = window.location.href.split("/");
    if(parts.length != 4) {
        $scope.filterString = document.title;
    } else {
        $scope.filterString = '';
    }
    $scope.more = function() {
        $scope.quantity += 5;
    }
});

/**
 * Receive a complete list of all comments
 */
myApp.controller("WikiquoteCtrl",function ($scope) {
    WikiquoteApi.getRandomQuote("Programming|Computer",
        function(newQuote) {
            $scope.wikiquote = newQuote.quote;
            $scope.$apply();
        },
        function(msg){
            console.log("Error while retrieving quote from wikiquote "+msg);
        }
    );
});

/**
 * Function for table sort and search
 */
myApp.controller("TableCtrl",function ($scope, $http) {
    var postsUrl = "/postsFrontpage.json";
	$http({method: 'GET', url: postsUrl}).
		success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available
			console.log("Successfully received json containing all posts")
			$scope.posts = {
				entries: data
			}
		}).
		error(function(data, status, headers, config) {
			alert("Error while getting json for posts: "+status)
	});

    $scope.orderByField = 'Date';
    $scope.reverseSort = false;
    $scope.searchText = "";
});

/**
 * GitHub controller using the GitHub service
 */
myApp.controller("GithubCtrl", function ($scope, $location, $http, UserModel, GithubSrvc) {	
	// login by the owner of the repository: edits on the blog are possible
	// login by someone else: create an empty fork of the repository, automatically available
	//      - ask for a name: the fork will be created for that name: xyz.github.io
	//      - poll for repo.contents until the forked repo is ready
	//      - guide them with a link to the new repo and encourage them to click on "edit"
	
	// if no token is available listen for button click...
	$scope.user = {};
	($scope.login = function() {
		console.log("Request login");
		var user = UserModel.getUser();
		if(typeof user !== 'undefined') {
			console.log("found user object in localStorage");
			console.log(user);
			$scope.user = user;
		} else {
			GithubSrvc.helloGithub();
		}
	})();

	// Request a login code from github if the user presses the login button
    $scope.requestCode = function() {
        GithubSrvc.requestCode();
    }

	// logout - this is not really a logout from github, but the access token is deleted
	$scope.logout = function() {
		console.log("Logout");
		GithubSrvc.goodByeGithub();
	}

	// bind user model to the view and listen for events
	//$scope.user = UserModel.user;
	$scope.$on('UserModel::userLoggedIn', function(event) {
		console.log("the GithubCtrl received an userLoggedIn event for user: "+UserModel.user.name);
        $scope.user = UserModel.user;
		//$scope.$apply();
    });
	$scope.$on('UserModel::userLoggedOut', function(event) {
		console.log("the GithubCtrl received an userLoggedOut event");
        $scope.user = "";
    });
});

myApp.controller('ConfigCtrl', function($scope, $window, GithubSrvc) {
    $scope.inputs = {}
	$scope.inputs = $window.config,
    $scope.setOutput = function(key, key2, newValue) {
        $scope.inputs[key][key2] = newValue;
    }
	
	$scope.githubCommit = function() {
		var config = "var config = "+JSON.stringify($scope.inputs);
		console.log(config);
		GithubSrvc.commit(config, "app/js/config.js");
	}

	var content = GithubSrvc.editContent("_config.yml");
	content.then(function(data) {
		var configLine = data.split('\n');
        var newConfigData = "";
		for(var i = 0;i < configLine.length;i++){
			var split = configLine[i].split(":");
			if(configLine.indexOf(":")!==-1 && split[1]!=="") {
                if(split[0].indexOf("name")!==-1) {
                    newConfigData += split[0]+": HAAHHAHHAHA\n"
                } else {
                    newConfigData += configLine[i]+"\n";
                }

			} else {
                newConfigData += configLine[i]+"\n";
            }
		}
        console.log(newConfigData);
	});
});

myApp.controller('ToasterController', function($scope, toaster) {
    // save a reference to the current scope...
	var scope = $scope;
	
	$scope.$on('Toast::githubCommitSuccess', function(event) {
		scope.pop();
	});
	
	$scope.pop = function(text){
		console.log("TOAAAST!");
		toaster.pop('success', "Commit to GitHub successful", '<ul><li>Edits saved on GitHub. Changes take some time to appear (refresh page after around 1 minute)...</li></ul>', 5000, 'trustedHtml');
		$scope.$apply();
    };
    
    $scope.clear = function(){
        toaster.clear();
    };
});

myApp.controller('GithubForkCtrl', function($scope, $http, $q, toaster, StyleSwitcher, GithubSrvc, PollingSrvc, PollingImgSrvc) {
	var scope = $scope;
	scope.success = false;
	
    $scope.options = {}
    $scope.options.forkSlogan = "Yihaa"             // Default title
    $scope.options.forkName = "";                   // Gets overridden, when the user is logged in
    $scope.options.forkRealName = "";               // Gets overridden, when the user is logged in
    $scope.options.twitter = "";               // Gets overridden, when the user is logged in
    $scope.options.ssl = "";
    $scope.options.github = "";
	$scope.options.selectedTheme = "lumen";
    $scope.options.availableThemes = [
      {name:'angularui'},
      {name:'darkly'},
      {name:'flatly'},
      {name:'lumen'},
      {name:'simplex'},
	  {name:'spacelab'},
	  {name:'simplex'},
	  {name:'superhero'},
	  {name:'yeti'}
    ];

    var checkUnique = function() {
        var url = "";
        var forkName = $scope.options.forkName;
		
        if($scope.options.forkName.length>4) {
            if($scope.options.forkName.indexOf(".")===-1) {
                url =  "http://"+$scope.options.forkName+".github.com";
            }

            this.img = new Image();

            this.img.onload = function() {_good();};
            this.img.onerror = function(e) { error(e);};

            this.img.src = "https://"+$scope.options.forkName;

            var good= function() {
                console.log("yehh");
            }

            var error= function(e) {
                console.log("oh noooo");
                console.log(e);
            }


            //$http.jsonp("http://"+$scope.options.forkName+"&callback=JSON_CALLBACK");
            console.log("here the test should come if the url is available: "+$scope.options.forkName);
        }
    };
	
	// change theme
	var switchTheme = function() {
		StyleSwitcher.switch($scope.options.selectedTheme.name);
	}
	
    $scope.$watch('options.forkName', checkUnique);
	$scope.$watch('options.selectedTheme', switchTheme);


    $scope.$on('UserModel::userLoggedIn', function(event, userName) {
        console.log(event);
        $scope.options.forkName = userName+".github.com";
        $scope.options.forkRealName = userName;
        $scope.options.twitter = userName;
        $scope.options.ssl = userName+".github.com";
        $scope.options.github = userName;
        $scope.$apply();
    });

    $scope.fork = function() {
        var forkName = $scope.options.forkName;
        var forkSlogan = $scope.options.forkSlogan;
        var name = $scope.options.forkRealName;
        var twitter = $scope.options.twitter;
        var ssl = $scope.options.ssl;
        var github = $scope.options.github;
        var theme = $scope.options.selectedTheme.name;

        // pass in options
        GithubSrvc.fork($scope.options)
        .then( function() {
			scope.progress = 10;
            return PollingSrvc.checkForBranchContent("maltretieren.github.com", "master")
        })
        .then( function() {
			scope.progress = 20;
            return GithubSrvc.renameRepo(forkName);
        })
        .then( function() {
			scope.progress = 30;
            return PollingSrvc.checkForBranchContent(forkName, "template")
        })
        .then( function() {
			scope.progress = 40;
            return GithubSrvc.deleteBranch(forkName, "heads/master")
        })
        .then( function() {
			scope.progress = 50;
            return GithubSrvc.createBranch(forkName, "master")
        })
		.then ( function() {
			scope.progress = 60;
			return GithubSrvc.deleteBranch(forkName, "heads/template")
		})
        .then( function() {
			scope.progress = 70;
            scope.pop("Fork to GitHub successful", "<ul><li>You will be notified, when the fork is ready...</li></ul>");
        })
        .then( function() {
             // the key is the string to search for
			 // the value is the text to replace with
			 var replace = {
                 title: forkSlogan,
                 name: name,
                 twitter: twitter,
                 github: github,
                 enforce_ssl: ssl,
                 theme: theme
             }
			 scope.progress = 80;
             return GithubSrvc.postProcess("_config.yml", replace);
        })
        .then(function(){
			scope.progress = 90;
            return PollingImgSrvc.checkReady();
        })
        .then(function() {
			scope.success = true;
			scope.progress = 100;
            return $q.when(scope.pop("Page available", "Visit "+forkName+" to see it live..."));
        })
	};
	
	$scope.$on('Toast::githubForkSuccess', function(event) {
		scope.pop();
	});
	
	$scope.pop = function(title, text){
		toaster.pop('success', title, text, 5000, 'trustedHtml');
		$scope.$apply();
    };
});

myApp.controller('GithubEditCtrl', function($scope, $dialogs, $modal, $timeout, ParameterSrvc, GithubSrvc) {
    var scope = $scope;

    $scope.options = {}
    var date = "";
    $scope.options.title = "";

    var path = ParameterSrvc.urlParams['path'];
    var url = ParameterSrvc.urlParams['url'];

    if(typeof(path) != 'undefined' && typeof(url) !='undefined') {
        var splif = path.split("-");
        date = splif[0].split("/")[1]+"-"+splif[1]+"-"+splif[2];
        $scope.options.title = "";
        for(var i=3;i<splif.length;i++) {
            if(i!==splif.length-1) {
                $scope.options.title += splif[i]+" ";
            } else {
                $scope.options.title += splif[i].split(".")[0];
            }
        }
    } else {
        console.log("new content...")
        path = "_posts/templates/2014-01-01-edit-template.md";
    }

    // promise to save...
    var promise = GithubSrvc.editContent(path);
    promise.then(function(content) {
        var commitPath = "";
        if($scope.options.date instanceof Date) {
            commitPath = "_posts/"+$scope.options.date.toISOString().slice(0,10)+"-"+$scope.options.title.replace(/ /g,"-")+".md";
        } else {
            commitPath = "_posts/"+$scope.options.date+"-"+$scope.options.title.replace(/ /g,"-")+".md";
        }

        //var path = "_posts/"+$scope.options.date.toISOString().slice(0,10)+"-"+$scope.options.title.replaceAll(" ","-")+".md";
        console.log("edit existing content");
        console.log("should check, if the path has changed... if yes, it should post/delete or move/commit")
        console.log("path"+path);
        console.log("content"+content);

        return GithubSrvc.commit(content, commitPath);
    }).then(function() {
        console.log("post saved.... wait for 5 seconds and redirect to the site...")
        $timeout(function(){
            if(typeof(url) !='undefined') {
                window.location = url;
            } else {
                console.log("post saved, there is no url provided to redirect - should be constructed from the commit path...")
            }
        }, 8000);
    });

    $scope.confirmed = 'You have yet to be confirmed!';
    $scope.delete = function() {
        console.log("delete....");
        var dlg = $dialogs.confirm('Please Confirm','Do you want to delete the post?');
        dlg.result.then(function(btn){
            GithubSrvc.deleteContent(path);
        },function(btn){
            console.log("cancel delete")
            //$scope.confirmed = 'Shame on you for not thinking this is awesome!';
        });
    }

    $scope.today = function() {
        $scope.options.date = new Date();
    };

    $scope.options.date = date;

    if(date==='') {
        $scope.today();
    } else {
        $scope.options.date = date;
    }

    $scope.clear = function () {
        $scope.options.date = null;
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.format = 'yyyy-MM-dd';
});