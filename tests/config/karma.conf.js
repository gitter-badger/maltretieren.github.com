module.exports = function(config){
    config.set({
        basePath : '../../',
		// manual definition, this is redundant to /app/js/main.js labjs file, but I didn't manage to reuse...
        files : [
			'assets/js/jquery-2.1.0/jquery-2.1.0.min.js',
			'app/js/config.js',
			'assets/js/oauth/jso.js',
			'assets/js/bootstrap-markdown-2.3.1/libs/to-markdown.js',
			'assets/js/bootstrap-markdown-2.3.1/libs/markdown.js',
			'assets/js/bootstrap-markdown-2.3.1/js/bootstrap-markdown.js',
			'assets/js/wikiquotes/wikiquote-api.js',
			'assets/js/listjs-0.2.0/list.js',
			'assets/js/angular-1.3.0/angular.min.js',
			'assets/js/angular-1.3.0/angular-route.min.js',
			'assets/js/angular-1.3.0/angular-animate.min.js',
			'assets/js/angular-1.3.0/angular-sanitize.min.js',
			'assets/js/dialogs-3.0/dialogs.min.js',
			'assets/js/bootstrap-tagsinput-0.3.9/bootstrap-tagsinput.min.js',
			'assets/js/bootstrap-tagsinput-0.3.9/bootstrap-tagsinput-angular.js',
			'assets/js/angular-1.3.0/angular-animate.min.js',
			'assets/js/angular-1.3.0/angular-resource.min.js',
			'app/js/routes.js',
			'assets/js/octokit-0.10.4/octokit.js',
			'assets/js/toaster-0.4.5/toaster.js',
			'assets/js/jszip-2.2.1/jszip.min.js',
			'assets/js/jszip-2.2.1/FileSaver.js',
			'assets/themes/bootstrap-3.1.1/js/bootstrap.min.js',
			'assets/themes/bootstrap-3.1.1/js/ui-bootstrap-tpls-0.10.0.min.js',
			'app/js/controllers.js',
			'app/js/services.js',
			'app/js/filters.js',
			'app/js/directives.js',
			'assets/js/raty/jquery.raty.js',
			'assets/js/keenio-2.1.0/keenio.js',
			'assets/js/angular-1.3.0/angular-mocks.js',
            'app/version.js',
            'tests/versionSpec.js'
        ],
		// list of files to exclude
		exclude: [
			'app/js/main.js'
		],
        autoWatch : false,
        frameworks: ['jasmine'],
        browsers : ['Chrome'],
        plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
			'karma-coverage'
        ],
		// https://github.com/karma-runner/karma-coverage
		// http://karma-runner.github.io/0.8/config/coverage.html
		// http://blog.dc.esri.com/2014/03/26/js-code-coverage/
		reporters: [
			'coverage'
		],
		preprocessors: {
		  // source files, that you wanna generate coverage for
		  // do not include tests or libraries
		  // (these files will be instrumented by Istanbul)
		  'app/js/*.js': ['coverage']
		},

		// optionally, configure the reporter
		coverageReporter: {
		  type : 'text',
		  dir : 'tests/coverage/'
		}
		
    })
}