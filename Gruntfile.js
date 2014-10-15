module.exports = function(grunt) {
    grunt.initConfig({
        karma: {
            unit: {
                configFile: 'tests/config/karma.conf.js',
                background: true
            },
            // Add a new travis ci karma configuration
            // configs here override those in our existing karma.conf.js
            travis: {
                configFile: 'tests/config/karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        watch: {
            // ...
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('devmode', ['karma:unit', 'watch']);

    // Add a new task for travis
    grunt.registerTask('test', ['karma:travis'])
};