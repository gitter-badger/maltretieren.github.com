'use strict';

/**
*	The controller must be responsible for binding model data to views using $scope.
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
	($scope.login = function() {
		console.log("Request login");
		GithubSrvc.helloGithub();
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
	$scope.user = UserModel.user.name;
	$scope.$on('UserModel::userLoggedIn', function(event) {
		console.log("the GithubCtrl received an userLoggedIn event for user: "+UserModel.user.name);
        $scope.user = UserModel.user.name;
		$scope.$apply();
    });
	$scope.$on('UserModel::userLoggedOut', function(event) {
		console.log("the GithubCtrl received an userLoggedOut event");
        $scope.user = "";
    });
});

myApp.controller('ConfigCtrl', function($scope, $http, GithubSrvc) {
    $scope.inputs = {}
	$http({method: 'GET', url: '/app/js/config.json'}).success(function(data, status, headers, config) {
		$scope.inputs = data;
	});
    $scope.setOutput = function(key, key2, newValue) {
        $scope.inputs[key][key2] = newValue;
    }
	
	$scope.githubCommit = function() {
		GithubSrvc.commit(JSON.stringify($scope.inputs), "app/js/config.json");
	}
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

myApp.controller('GithubForkCtrl', function($scope, toaster, GithubSrvc) {
	var scope = $scope;

    $scope.options = {}
    $scope.options.forkSlogan = "";
    $scope.options.forkName = GithubSrvc.user;

    var checkUnique = function() {
        var url = "";
        var forkName = $scope.options.forkName;

        if(forkName.length>4) {
            if(forkName.indexOf(".")===-1) {
                url =  "http://"+forkName+".github.io";
            }

            console.log("here the test should come if the url is available: "+url);
        }
    };

    $scope.$watch('options.forkName', checkUnique);

    $scope.fork = function() {
        // pass in options
		GithubSrvc.fork($scope.options);
	};
	
	$scope.$on('Toast::githubForkSuccess', function(event) {
		scope.pop();
	});
	
	$scope.pop = function(text){
		toaster.pop('success', "Fork to GitHub successful", '<ul><li>You will be notified, when the fork is ready...</li></ul>', 5000, 'trustedHtml');
		$scope.$apply();
    };
});

myApp.controller('PostCtrl', function($scope, toaster, GithubSrvc) {
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];
});