var saveMarkup = function() {
	var saveContent = $("#target-editor").val();
	var saveComment = $("#saveComment").val();
	console.log(saveComment);
	var usernameField = "Maltretieren";
	var passwordField = $("#password").val();
	var github = new Github({
		username: usernameField,
		password: passwordField,
	  auth: "basic"
	});
	var path = $('#path').text();
	var repo = github.getRepo("Maltretieren", "maltretieren.github.com");
	repo.write('master', path, saveContent, saveComment, function(callback) {
        var url = $('#url').text()+"?success=true";
        window.location = url;
	});
};

var getMarkup = function() {
    $("#target-editor").val("");
	var usernameField = "Maltretieren";
	var passwordField = $("#password").val();
	
	var oauthToken = localStorage.getItem("oauthToken");
	console.log("oauthToken: "+oauthToken);
	if(typeof oauthToken != 'undefined' && oauthToken != null) {
		console.log("oauthToken is available");
	} else {
		console.log("oauthToken is not available");
	}
	
	var github = new Github({
		username: usernameField,
		password: passwordField,
	  auth: "basic"
	});
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
			height:500
		});
		$('#target-editor').show();
	}
	
	var oauthCode = urlParams['code'];
	if(typeof oauthCode != 'undefined') {
		$.getJSON('http://maltretieren.herokuapp.com/authenticate/'+oauthCode, function(data) {
			console.log("final github token:"+data.token);
			localStorage.setItem("oauthToken", data.token);
		});
	}
	
	$('#oauthButton').click(function(e) {
		e.preventDefault();
		
		jso_configure({
			"github": {
				client_id: "e5923f3d7f1182fe886f",
				redirect_uri: "http://maltretieren.github.com",
				authorization: "https://github.com/login/oauth/authorize",
			}
		});
	
	 	$.oajax({
			jso_provider: "github",
			jso_allowia: true
		});
	});
	
})();