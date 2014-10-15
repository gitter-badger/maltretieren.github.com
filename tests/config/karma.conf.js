module.exports = function(config){
    config.set({
        basePath : '../../',
        files : [
            'app/**/*.js',
            'tests/**/*.js'
        ],
        autoWatch : false,
        frameworks: ['jasmine'],
        browsers : ['Chrome'],
        plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine'
        ],
        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }
    }
    )
}