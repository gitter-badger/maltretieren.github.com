'use strict';

/**
*	The controller must be responsible for binding model data to views using $scope,
 *	and control information flow.
*	It does not contain logic to fetch the data or manipulating it.
*/

/**
 * Receive a complete list of all comments
 */
myApp.controller("CommentsCtrl",function ($scope, $http, $timeout, toaster) {
	
	var commentsUrl = config.keenio.comments_url;
	// disable comments if there is no config for it...
	if(commentsUrl==='') {
		$scope.commentsToggle = false;
	} else {
		$scope.commentsToggle = true;
	}
	
	// hacky way to determine if it is the frontpage
    // -> on frontpage show all comments, on other pages
	// filter only comments matching the pageTitle
    var parts = window.location.href.split("/");
	if(parts[3] === '') {
		//console.log("no filter for comments");
		$scope.filterString = '';
    } else {
        $scope.filterString = '&filters=[{"property_name":"pageTitle","operator":"eq","property_value":"'+document.title+'"}]';
    }
    $scope.more = function() {
        $scope.quantity += 3;
    }
	
    $scope.getComments = function() {
		$http({method: 'GET', url: commentsUrl+$scope.filterString})
        .success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.comments = {
                entries: data.result
            }
        })
        .error(function(data, status, headers, config) {
            //alert("Error while getting comments from keen.io: "+status)
        });
	}
	$scope.getComments();

    $scope.quantity = 3;
    $scope.sortorder = 'created_at';
	$scope.deleteComment = function(event) {
		var id = event.target.id;
		console.log("Delete: "+id);
		//https://api.keen.io/3.0/projects/532b3e5a00111c0da1000006/events/comments?api_key=MASTERKEY&filters=<your_filters_here>
	}
	
	// comments form
	$scope.submit = function() {
		var data = {
			"name": $scope.userName,
			"email": $scope.userMail,
			"message": $scope.commentText,
			"pageTitle": $scope.pageTitle,
			"pageUrl": $scope.pageUrl
		} 

		var success = function() {
			toaster.pop('success', "Comment saved", '<ul><li>Comment was saved and will be available shortly</li></ul>', 5000, 'trustedHtml');
			$timeout($scope.getComments, 5000);
			$scope.$apply();
		}
		var error = function() {
			toaster.pop('error', "Comment failed", '<ul><li>There was an error while saving the comment</li></ul>', 5000, 'trustedHtml');
			$scope.$apply();
		}
		Keen.addEvent("comments", data, success);
	}
	$scope.userName = "";
	$scope.userMail = "";
	$scope.commentText = "";
});

/**
 * Receive a complete list of all comments
 */
myApp.controller("WikiquoteCtrl",function ($scope) {
    var wikiquote = function() {
        WikiquoteApi.getRandomQuote("Programming|Computer",
            function(newQuote) {
                $scope.wikiquote = newQuote.quote;
                $scope.$apply();
            },
            function(msg){
                console.log("Error while retrieving quote from wikiquote "+msg);
            }
        );
    }
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
			//console.log("Successfully received json containing all posts")
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

myApp.controller("GithubModalCtrl", function ($scope, $modalInstance, UserModel, GithubAuthService, GithubSrvc) {
	$scope.user = {}
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');  
	}; // end cancel
	
	$scope.save = function() {
        console.log($scope.user.name);
        GithubAuthService.instance($scope.user.name, $scope.user.password);
        GithubAuthService.userInfo().user().then(function() {
            console.log("test if the user is the admin");
            UserModel.setUserName($scope.user.name);
            UserModel.setPassword($scope.user.password);
            $modalInstance.dismiss('canceled');
            GithubSrvc.testAdmin();
        }, function() {
            console.log("Username invalid");
            GithubAuthService.logout();
        });
	};
});

/**
 * GitHub controller using the GitHub service
 */
myApp.controller("GithubCtrl", function ($scope, $location, $http, $dialogs, ParameterSrvc, UserModel, GithubSrvc, GithubAuthService) {
	// login by the owner of the repository: edits on the blog are possible
	// login by someone else: create an empty fork of the repository, automatically available
	//      - ask for a name: the fork will be created for that name: xyz.github.io
	//      - poll for repo.contents until the forked repo is ready
	//      - guide them with a link to the new repo and encourage them to click on "edit"
	

	$scope.user = UserModel.user;
	if(config.heroku.authenticate != "") {
		$scope.githubLogin = true;
	} else {
		$scope.githubLogin = false;
	}
	
	// if no token is available listen for button click...
	($scope.login = function() {
		var user = UserModel.getUser();
		// first check if there is a valid user already stored in the localStorage
		if(typeof user !== 'undefined' && user !== null) {
			//console.log("found a valid user object in localStorage, use that...");
			$scope.user = user;
		} else {
			console.log("no user object found in localStorage - if a code is provided use that to get a token");
			var oauthCode = ParameterSrvc.urlParams['code'];
			if(typeof oauthCode !== 'undefined') {
				console.log("code provided, request a token with that code");
				GithubAuthService.requestToken(oauthCode).then(function() {
					console.log("token available");
				}).then(function() {
					console.log("request user");
					return GithubAuthService.userInfo().user();
				}).then(function(loginData) {
                    UserModel.setUserName(loginData.login);
					console.log("test if the user is the admin");
					return GithubSrvc.testAdmin();
				}).then(function() {
					console.log("login done....");
				});
			} else {
				console.log("nothing to do, wait for the user to press the login button");
			}
		}
	})();

	// Request a login code from github if the user presses the login button
	$scope.requestCode = function() {
		if($scope.githubLogin) {
			GithubSrvc.requestCode();
		} else {
			var dlg = $dialogs.create('/app/partials/githubLogin.html','GithubModalCtrl',{},{key: false});
			dlg.result.then(function(name, password){
				//$scope.name = name;
			},function(){
				console.log("exit");
			});
		}
    }

	// logout - this is not really a logout from github, but the access token is deleted
	$scope.logout = function() {
		GithubAuthService.logout();
	}

	// bind user model to the view and listen for events
	$scope.$on('UserModel::userLoggedIn', function(event) {
		console.log("the GithubCtrl received an userLoggedIn event for user: "+UserModel.user.name);
        var user = UserModel.getUser();
		if(typeof user !== 'undefined' && user !== null) {
			$scope.user = user;
		}
    });
	$scope.$on('UserModel::userLoggedOut', function(event) {
		console.log("the GithubCtrl received an userLoggedOut event");
        $scope.user = "";
    });
});

myApp.controller('ConfigCtrl', function($scope, GithubSrvc) {
    $scope.inputs = {}
	$scope.inputs = config,
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

myApp.controller('GithubForkCtrl', function($scope, $http, $q, $timeout, toaster, UserModel, StyleSwitcher, GithubSrvc, GithubAuthService, PollingSrvc, PollingImgSrvc) {
	var scope = $scope;
	scope.success = false;
	
    $scope.options = {}
    $scope.options.forkSlogan = "Yihaa"             // Default title
    $scope.options.forkName = UserModel.getUser().name+".github.com";                   // Gets overridden, when the user is logged in
    $scope.options.forkRealName = UserModel.getUser().name;               // Gets overridden, when the user is logged in
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
            return PollingSrvc.checkForBranchContent(config.github.repository, "master")
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
             return GithubSrvc.postProcess("_config.yml", replace, forkName);
        })
        .then(function() {
            console.log("update config");
            var commitPromise = $q.defer();

            var modifiyConfig = function() {
                var configMod = {}
                for (var key in config) {
                    var obj = config[key];
                    configMod[key] = {};
                    for (var prop in obj) {
                        // important check that this is objects own property
                        // not from prototype prop inherited
                        if(obj.hasOwnProperty(prop)){
                            if(prop==="user") {
                                configMod[key][prop] = name;
                            } else if(prop=="repository"){
                                configMod[key][prop] =name+".github.com";
                            } else {
                                configMod[key][prop] = "";
                            }
                        }
                    }
                }
                var githubInstance = GithubAuthService.instance();
                var repo = githubInstance.getRepo(UserModel.getUser().name, UserModel.getUser().name+".github.com");
                var branch = repo.getBranch("master");
                var configModJson = "var config = "+JSON.stringify(configMod);
                scope.progress =83;
                GithubSrvc.commit(configModJson, "app/js/config.js", branch, false, true).then(function() {
                    commitPromise.resolve();
                }, function() {
                   console.log("commit errrror");
                })
            }
            $timeout(modifiyConfig, 1000);

            return commitPromise.promise;
        })
        .then(function() {
            // commit to make sure it shows the right page
            console.log("commit a post")
            var commitPromise = $q.defer();
            var modifiyConfig = function() {
                var githubInstance = GithubAuthService.instance();
                var repo = githubInstance.getRepo(UserModel.getUser().name, UserModel.getUser().name+".github.com");
                var branch = repo.getBranch("master");
                var content = "---\nlayout: post\ncategories:\n- frontpage\ntagline: \ntags:\n- development\n- jekyll\npublished: true\n---\n{% include JB/setup %}\nHi, this is the first post!";
                scope.progress = 86;
                var date = new Date();
                GithubSrvc.commit(content, "_posts/"+date.toISOString().slice(0,10)+"-hello-world.md", branch, false, true).then(function() {
                    commitPromise.resolve()
                });
            }
            $timeout(modifiyConfig, 1000);
            return commitPromise.promise;
        })
        .then(function(){
			scope.progress = 90;
            return PollingImgSrvc.checkReady(UserModel.getUser().name+".github.com");
        })
        .then(function() {
			scope.success = true;
			scope.progress = 100;
            return $q.when(scope.pop("Page available", "Visit "+forkName+" to see it live..."));
        })
	};
	
	$scope.$on('Toast::githubForkSuccess', function(event) {
		//scope.pop();
	});
	
	$scope.pop = function(title, text){
		toaster.pop('success', title, text, 5000, 'trustedHtml');
		$scope.$apply();
    };
});

/**
*	This controller unlocks/lock admin functionality
*/
myApp.controller('AdminCtrl', function($scope, UserModel) {
	// binding to hide the edit button for non-admin users...
	var user = UserModel.getUser();
	if(user !== null) {
		$scope.isAdmin = UserModel.getUser().isAdmin;
	} else {
		$scope.isAdmin = false;
	}
});

/**
*	This controller exports/imports post as a zip
*/
myApp.controller('ExportCtrl', function($scope, $dialogs, GithubSrvc) {
	// binding to hide the edit button for non-admin users...
	$scope.export = [];
	$scope.exportSelection = [];
	$scope.exportStatus = 0;
	$scope.maxValue = 0;
	$scope.processingPostNr = 0;
	$scope.type = 'info';

	var fileCountPromise = GithubSrvc.getContents("_posts");
	fileCountPromise.then(function(files) {
		console.log("There are "+files.length+" files to process");
		$scope.export = files;
        // this is for the loading bar
		$scope.maxValue = $scope.exportSelection.length;
	}, function(reason) {
		console.log("There was a ready counting all files to export");
	}, function(update) {
		console.log("Update from the fileCount process: "+update);
	});
	
    $scope.zip = function() {
		var filePromise = GithubSrvc.getFiles($scope.exportSelection);
		filePromise.then(function(contents) {
			console.log("files available - zip them");
			console.log(contents);
			
			var zip = new JSZip();
			for(var i in contents) {
				zip.file(i, contents[i]);
			};
			var content = zip.generate({type:"blob"});
			var date = new Date();
			$scope.type = 'success';
            $scope.maxValue = $scope.exportSelection.length;
			saveAs(content, date.toISOString().slice(0,10)+"-posts-export.zip");
		}, function(reason) {
			console.log("There was a error to export the posts: "+reason);
		}, function(update) {
			console.log("Update Notification: "+update);
			console.log("percentage: "+percentage);
			$scope.processingPostNr = update;
            var percentage = (update * 100) / $scope.exportSelection.length;
			$scope.exportStatus = percentage;
		});
	}
	
	$scope.selectAllExport = function() {
        console.log($scope.export);
		$scope.exportSelection = angular.copy($scope.export);
    }
	$scope.unselectAllExport = function() {
		$scope.exportSelection = [];
	}
});

/**
 *	This controller exports/imports posts as a zip
 */
myApp.controller('ImportCtrl', function($scope, $dialogs, GithubSrvc) {
    // binding to hide the edit button for non-admin users...
    $scope.import = [];
    $scope.importSelection = [];
    $scope.importStatus = 0;
    $scope.maxValue = 0;
    $scope.processingPostNr = 0;
    $scope.type = 'info';

    var importValue = [];
    $scope.add = function(){
        var f = document.getElementById('file').files[0],
            r = new FileReader();
        var importTemp = [];

        r.onloadend = function(e){
            var data = e.target.result;
            var zip = new JSZip(data);
            var i = 0;
            for(var file in zip.files) {
                var fileObj = zip.files[file];
                var isDir = endsWith(fileObj.name, "/");
                if(!isDir) {
                    importTemp[i] = fileObj.name;
                    importValue[fileObj.name] = fileObj.asText();
                    i++;
                }
            }
            $scope.import = importTemp;
            $scope.$apply()
        }
        r.readAsBinaryString(f);
    }

    $scope.selectAllImport = function() {
        //console.log($scope.import);
        $scope.importSelection = $scope.import;
        //console.log($scope.importSelection);
    }
    $scope.unselectAllImport = function() {
        $scope.importSelection = [];
    }

    $scope.showContent = function(selected) {
        console.log(selected);
        var value = $scope.import[selected].asText();
        var dlg = $dialogs.confirm(selected,value);
        dlg.result.then(function(btn){
            //GithubSrvc.deleteContent(path);
        },function(btn){
            console.log("cancel delete")
            //$scope.confirmed = 'Shame on you for not thinking this is awesome!';
        });
        console.log();
    }

    $scope.doImport = function() {
        var importObject = {};
        for(var i=0; i<$scope.importSelection.length;i++) {
            var key = $scope.importSelection[i];
            var value = importValue[$scope.importSelection[i]];
            importObject[key] = value;
        }

        var showMessage = false;
        var force = false;
        GithubSrvc.commitMany(importObject, "Import", false, false);
    }

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
});

myApp.controller('GithubEditCtrl', function($scope, $dialogs, $modal, $timeout, toaster, UserModel, ParameterSrvc, GithubSrvc) {
    var scope = $scope;

    $scope.options = {}
    
	var date = "";
    $scope.options.title = "";
	$scope.options.isNewContent = false;
	
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
		$scope.options.isNewContent = true;
        console.log("new content...")
        path = "_posts/templates/2014-01-01-edit-template.md";
    }

    // promise to save...
    var promise = GithubSrvc.editContent(path);
	$scope.commitPath = "";
    promise.then(function(content) {
        var commitPath = "";
        if($scope.options.date instanceof Date) {
            $scope.commitPath = $scope.options.date.toISOString().slice(0,10)+"-"+$scope.options.title.replace(/ /g,"-")+".md";
        } else {
            $scope.commitPath = $scope.options.date+"-"+$scope.options.title.replace(/ /g,"-")+".md";
        }

        //var path = "_posts/"+$scope.options.date.toISOString().slice(0,10)+"-"+$scope.options.title.replaceAll(" ","-")+".md";
        console.log("edit existing content");
        console.log("should check, if the path has changed... if yes, it should post/delete or move/commit")

        return GithubSrvc.commit(content, "_posts/"+$scope.commitPath);
    }).then(function() {
        toaster.pop('success', "Post saved", '<ul><li>The post was successfully saved. You will be redirected to the post in around 10 seconds...</li></ul>', 5000, 'trustedHtml');
        // redirect to the frontpage after 10 seconds
		console.log($scope.commitPath.replace("-","/"));
		$timeout(function(){
			if(typeof(url) !='undefined') {
                window.location = url;
            } else {
				window.location = config.github.redirection_url+"/frontpage/"+$scope.commitPath.replace("-","/");
            }
        }, 10000);
    });

    $scope.confirmed = 'You have yet to be confirmed!';
    $scope.delete = function() {
        console.log("delete....");
        var dlg = $dialogs.confirm('Please Confirm','Do you want to delete the post?');
        dlg.result.then(function(btn){
            var deletePromise = GithubSrvc.deleteContent(path);
			deletePromise.then(function() {
				toaster.pop('error', "Post deleted", '<ul><li>The post was successfully deleted. You will be redirected to the frontpage shortly...</li></ul>', 5000, 'trustedHtml');
				$scope.$apply();
				$timeout(function(){
					window.location = config.github.redirection_url;
				}, 5000);
			});
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

myApp.controller('RatingCtrl', function($scope) {
    var ratyElements =  $('.raty');
    var success = function (data) {
        alert("success");
    }
    for(var i=0;i<ratyElements.length;i++) {
        $(ratyElements[i]).raty({
            path: 'assets/js/raty/images',
            click: function(score, evt) {
                accessoireRating(this.id, score);
            }
        });

    }

    var getRatings = function() {
        var url = "https://api.keen.io/3.0/projects/532b3e5a00111c0da1000006/queries/average?api_key=fca64cb411fe523d053f2d9b1d159011135be6ce55da682f1ad8d6b1d4f629b84dd564edb1c0d7a0d7575ebaaa79b55daa075f7c866d7430ace403bab51b7513aa41b30ce443f9d736d45d33c78a0b44420c2ecd35223b76d67af37df1d0cc52bf67e73cb32d949eb58cb5814e7e5e6a&event_collection=accessoires&timezone=3600&target_property=rating&group_by=id"
        var success = function (data) {
            for(i=0;i<data.result.length;i++)
            {
                var rating = data.result[i].result;
                var element = data.result[i].id.replace("?","");
                console.log(element);
                console.log(rating);
                //$("#"+element).parent().append(rating);
                $("#"+element).raty({
                    score: rating,
                    path: 'assets/js/raty/images',
                    click: function(score, evt) {
                        accessoireRating(this.id, score);
                    }
                });
            }
        };
        $.ajax({
            url: url,
            success: success
        });
    }
    getRatings();
});