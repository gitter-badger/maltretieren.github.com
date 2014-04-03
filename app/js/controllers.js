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
myApp.controller("GithubCtrl", function ($scope, UserModel, GithubSrvc) {
	// if token is available, fetch user information...
	var oauthToken = localStorage.getItem("oauthToken");
	if(oauthToken != "undefined" && oauthToken != null) {
		console.log("Token provided, get username");
		GithubSrvc.helloGithub();
	}
	
	// if no token is available listen for button click...
	$scope.loginWithGithub = function() {
		console.log("Request login");
		GithubSrvc.helloGithub();
	}

	$scope.user = UserModel.user.name;
	$scope.$on('UserModel::userLoggedIn', function(event) {
		console.log("the GithubCtrl received an userLoggedIn event for user: "+UserModel.user.name);
        $scope.user = UserModel.user.name;
    });
});