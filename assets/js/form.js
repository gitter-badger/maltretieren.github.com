    var form = document.getElementById("comment");

    form.onsubmit = function (e) {
        // stop the regular form submission
        e.preventDefault();

        // collect the form data while iterating over the inputs
        var data = {};
        for (var i = 0, ii = form.length; i < ii; ++i) {
            var input = form[i];
            console.log(input);
            if (input.name) {
                data[input.name] = input.value;
            }
        }

        commentForm("comments", data);
    };

    var getComments = function() {
        var url = "https://api.keen.io/3.0/projects/532b3e5a00111c0da1000006/queries/extraction?api_key=fca64cb411fe523d053f2d9b1d159011135be6ce55da682f1ad8d6b1d4f629b84dd564edb1c0d7a0d7575ebaaa79b55daa075f7c866d7430ace403bab51b7513aa41b30ce443f9d736d45d33c78a0b44420c2ecd35223b76d67af37df1d0cc52bf67e73cb32d949eb58cb5814e7e5e6a&event_collection=comments&timezone=3600"
        var success = function (data) {
            var renderData = data.result.slice(5, data.length);
				if ( angular.isArray(data.result) ) {
					$scope.comments = data.result;
				}
				else {
					$scope.comments = [data.result];
				}
			});
			
            $.get('/assets/templates/comments.mustache', function(template) {
                // Filter array to match current page title, on frontpage show everything
                var title = document.title;
                // n is the current element, i the index
                var result = data;

                // a little hacky way to know if it is the frontpage
                var parts = window.location.href.split("/");
                if(parts.length != 4) {
                    var resultSet = $.grep(data.result, function (element) {
                        return (element.pageTitle === title);
                    });
                    result = {result:resultSet};
                };

                var output = Mustache.render(template, result);
                $('#comments').append(output);
            });
                //$("#comments").append("<div class='comment'><div class='commentheader'><div class='commentgravatar'>" + '<img src="" alt="" width="20" height="20">' + "</div><a class='commentuser' href=''></a><a class='commentdate' href=''></a></div><div class='commentbody'>" + message + "</div></div>");

        };

        $.ajax({
            url: url,
            success: success
        });
    }

    var options = {
        valueNames: ['date', 'title', 'tags']
    };

    var entryList = new List('entry-list', options);

    getComments();
