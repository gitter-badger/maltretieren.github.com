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
    })

    // Load the plugin that provides the "grunt-git" task.
    grunt.loadNpmTasks('grunt-git');

    // Default task(s).
    grunt.registerTask('default', ['gitcommit']);

};