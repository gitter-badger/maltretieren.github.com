var saveMarkup = function() {
	var saveContent = $("#content").val();
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
		alert("saved!");
	});
};

var getMarkup = function() {
    $("#content").val("");
	var usernameField = "Maltretieren";
	var passwordField = $("#password").val();
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
        $("#content").val(contents);
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
			data-iconlibrary:"fa"
		});
		$('#target-editor').show();
	}
})();