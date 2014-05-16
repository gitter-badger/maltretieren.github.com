module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        gitcommit: {
            your_target: {
                options: {
                    message: 'Testing'
                },
                files: {
                    // Specify the files you want to commit
                }
            }
        },
        karma: {
            unit: {
                configFile: 'tests/karma.conf.js'
            }
        }
    })

    // Load the plugin that provides the "grunt-git" task.
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-karma');

    // Default task(s).
    grunt.registerTask('default', ['karma']);

    if (grunt.option('debug')) {
        console.log(grunt.config('karma.unit.configFile'));
    }
};