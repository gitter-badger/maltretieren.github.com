// HOWTO: load LABjs itself dynamically!
// inline this code in your page to load LABjs itself dynamically, if you're so inclined.

(function (global, oDOC, handler) {
    var head = oDOC.head || oDOC.getElementsByTagName("head");

    function LABjsLoaded() {
         // Load the scripts. All scripts depend on jQuery. Then,
		// only the cat-lover script depends on the friend.js to
		// be loaded (so it can extend it).
		//
		// NOTE: We are storing a reference to the QUEUE so that
		// we can refer to it later in the code.
		var queue = $LAB
        .script( "/assets/js/jquery/jquery-2.1.0.min.js" )
		.script( "/assets/js/oauth/jso.js" )
        .script( "/assets/js/keenio.js" )
        .script( "/assets/js/list.js" )
		.script( "/assets/js/chevron.js" )
		.script( "/assets/js/github/base64.js" )
		.script( "/assets/js/github/underscore-min.js" )
		.script( "/assets/js/github/github.js" )
		.script( "/assets/js/bootstrapMarkdown/libs/to-markdown.js" )
		.script( "/assets/js/bootstrapMarkdown/libs/markdown.js" )
		.script( "/assets/js/bootstrapMarkdown/js/bootstrap-markdown.js" )
        .script ( "/assets/js/wikiquotes/wikiquote-api.js" )
		.script( "/assets/js/github/github-functions.js" )
		.script( "/assets/js/list.js" )
		.script( "/assets/js/form.js" )
        .script( "/assets/js/angular/angular.min.js" )
        .script( "/assets/js/angular/angular-route.min.js" )
        .script( "/assets/js/angular-app/routes.js" )
        .script( "/assets/themes/bootstrap-3.1.1/js/bootstrap.min.js" )
        .script("/assets/themes/bootstrap-3.1.1/js/ui-bootstrap-tpls-0.10.0.min.js")
        .script( "/assets/js/angular-app/services.js" )
        .script( "/assets/js/angular-app/controllers.js" )
        .script( "/assets/js/angular-app/filters.js" )
        .script( "/assets/js/angular-app/directives.js" )
        .script( "/assets/js/angular-app/example.js" )
            .wait(function(){
                // this is needed for manual bootstrapping
                // angularjs, otherwise it's called wrong time
                angular.bootstrap(document.body ,['myApp']);
            })
    }

    // loading code borrowed directly from LABjs itself
    setTimeout(function () {
        if ("item" in head) { // check if ref is still a live node list
            if (!head[0]) { // append_to node not yet ready
                setTimeout(arguments.callee, 25);
                return;
            }
            head = head[0]; // reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
        }
        var scriptElem = oDOC.createElement("script"),
            scriptdone = false;
        scriptElem.onload = scriptElem.onreadystatechange = function () {
            if ((scriptElem.readyState && scriptElem.readyState !== "complete" && scriptElem.readyState !== "loaded") || scriptdone) {
                return false;
            }
            scriptElem.onload = scriptElem.onreadystatechange = null;
            scriptdone = true;
            LABjsLoaded();
        };
        scriptElem.src = "/assets/js/LAB.min.js";
        head.insertBefore(scriptElem, head.firstChild);
    }, 0);

    // required: shim for FF <= 3.5 not having document.readyState
    if (oDOC.readyState == null && oDOC.addEventListener) {
        oDOC.readyState = "loading";
        oDOC.addEventListener("DOMContentLoaded", handler = function () {
            oDOC.removeEventListener("DOMContentLoaded", handler, false);
            oDOC.readyState = "complete";
        }, false);
    }
})(window, document);
