var saveMarkup = function() {
	var saveContent = $("#content").val();
	var usernameField = "Maltretieren";
	var passwordField = $("#password").val();
	var github = new Github({
		username: usernameField,
		password: passwordField,
	  auth: "basic"
	});
	var repo = github.getRepo("Maltretieren", "maltretieren.github.com");
	repo.write('master', '_posts/core-samples/2014-03-24-github-edits.md', saveContent, 'First Commit from client side', function(err) {});
};

var getMarkup = function() {
    var github = new Github({
        username: "Maltretieren",
        password: $("#password").val(),
        auth: "basic"
    });
    var path = $('#path').text();
    var repo = github.getRepo("Maltretieren", "maltretieren.github.com");
    repo.read("master", path, function(err, contents) {
        $("#content").val(contents);
    });
};

(function() {
	getMarkup()
)();