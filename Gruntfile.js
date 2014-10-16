module.exports = function(grunt) {
    grunt.initConfig({
        karma: {
            // Add a new travis ci karma configuration
            // configs here override those in our existing karma.conf.js
            travis: {
                configFile: 'tests/config/karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        }
    });
	grunt.loadNpmTasks('grunt-karma');

    // Add a new task for travis
    grunt.registerTask('test', ['karma:travis'])
};