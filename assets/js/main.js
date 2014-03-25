(function() { 
	var scripts = {
		Mustache: '/assets/js/mustache',
		Form: '/assets/js/form',
		Chevron: '/assets/js/chevron',
		Github: '/assets/js/github/github',
		Base64: '/assets/js/github/base64',
		Underscore: '/assets/js/github/underscore-min',
		GithubFunctions: '/assets/js/github/github-functions'
	}

	// Very simple asynchronous script-loader
	for (var i=0; i<scripts.length; i++) {
		// Create a new script element
		var script      = document.createElement('script');
		// Find an existing script element on the page (usually the one this code is in)
		var firstScript = document.getElementsByTagName('script')[0];
		// Set the location of the script
		script.src      = scripts[i];
		// Inject with insertBefore to avoid appendChild errors
		firstScript.parentNode.insertBefore( script, firstScript );
	}
});