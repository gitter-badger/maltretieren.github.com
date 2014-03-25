(function() { 
	var scripts = {
		Jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',
		Mustache: '/assets/js/mustache.js',
		Form: '/assets/js/form.js',
		Chevron: '/assets/js/chevron.js',
		Base: '/assets/js/github/base64.js',
		Underscore: '/assets/js/github/underscore-min.js',
		Github: '/assets/js/github/github.js',
		GithubFunctions: '/assets/js/github/github-functions.js;
	};

	// Very simple asynchronous script-loader

	for (var prop in scripts) {
		if (scripts.hasOwnProperty(prop)) {
			// Create a new script element
			var script      = document.createElement('script');
			// Find an existing script element on the page (usually the one this code is in)
			var firstScript = document.getElementsByTagName('script')[0];
			// Set the location of the script
			script.src      = scripts[prop];
			console.log("Script loaded: "+scripts[prop]) ;
			// Inject with insertBefore to avoid appendChild errors
			firstScript.parentNode.insertBefore( script, firstScript );
		}
	}
})();