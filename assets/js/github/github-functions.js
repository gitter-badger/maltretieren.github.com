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
	var github = new Github();
    var path = $('#path').text();
    var repo = github.getRepo("Maltretieren", "maltretieren.github.com");
    repo.read("master", path, function(err, contents) {
        $("#content").val(contents);
    });
};

(function() {
	getMarkup();
})();