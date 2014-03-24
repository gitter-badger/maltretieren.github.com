require.config({
    baseUrl: '/assets/js',
    paths: {
        Mustache: '/assets/js/mustache',
        Form: '/assets/js/form',
        Chevron: '/assets/js/chevron',
        Github: '/assets/js/github/github',
        Base64: '/assets/js/github/base64',
        Underscore: '/assets/js/github/underscore-min',
        GithubFunctions: '/assets/js/github/github-functions'
    }
});

require(['Form'], function () {

});

require(['Github', 'Base64', 'Underscore', 'GithubFunctions'], function () {

});