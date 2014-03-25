var saveMarkup = function() {
	var saveContent = $("#content").val();
	var github = new Github({
		username: $(".username").val(),
		password: $(".password").val(),
	  auth: "basic"
	});
	var repo = github.getRepo("Maltretieren", "maltretieren.github.com");
	repo.write('master', 'test.html', saveContent, 'First Commit from client side', function(err) {});
};

var getMarkup = function() {
    var github = new Github({
        username: $(".username").val(),
        password: $(".password").val(),
        auth: "basic"
    });
    var path = $('#path').text();
    var repo = github.getRepo("Maltretieren", "maltretieren.github.com");
    repo.read("master", path, function(err, contents) {
        $("#content").val(contents);
    });
};