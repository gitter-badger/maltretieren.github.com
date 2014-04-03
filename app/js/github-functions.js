var saveMarkup = function(saveContent) {
    var github = null;
    var oauthToken = localStorage.getItem("oauthToken");
    if(oauthToken != "undefined" && oauthToken != null) {
        console.log("oauthToken is available");
        github = new Github({
            token: oauthToken,
            auth: "oauth"
        });
    } else {
        console.log("oauthToken is not available or not valid");
        alert("Did you login via github? Otherwise you can connect via Basic Authentication... Please provide a username and password...")
    }

    var path = $('#path').text();
    var repo = github.getRepo("Maltretieren", "maltretieren.github.com");
    repo.write("master", path, saveContent, "predifined comment", function(err) {
        var url = $('#url').text()+"?success=true";
        if(err) {
            alert("Maybe you are not the owner of this repo - you can try to commit a pull request...")
        } else {
            window.location = url;
        }
    });
};

var getMarkup = function() {
    $("#target-editor").val("");
	var usernameField = "Maltretieren";
	var passwordField = $("#password").val();
	
	var oauthToken = localStorage.getItem("oauthToken");
	var github = null;
	if(oauthToken != "undefined" && oauthToken != null) {
		console.log("oauthToken is available");
		github = new Github({
			token: oauthToken,
			auth: "oauth"
		});
	} else {
		console.log("oauthToken is not available or not valid");
		github = new Github({
			username: usernameField,
			password: passwordField,
			auth: "basic"
		});
	}
		
    var path = $('#path').text();
    var repo = github.getRepo("Maltretieren", "maltretieren.github.com");
    repo.read("master", path, function(err, contents) {
		if(err) {
			console.log("Error, maybe too many unothorized requests... "+err);
		}
        $("#target-editor").val(contents);
    });
};

/**
	This is a helper function
**/
var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

(function() {
	var editEnabled = urlParams['edit'];
	if(typeof editEnabled != 'undefined') {
		var editorContent = getMarkup();
		$('#target-editor').markdown({
			savable:true,
			height:500,
            onSave: function(e) {
                saveMarkup(e.getContent())
            }
		});
		$('#target-editor').show();
	}
})();