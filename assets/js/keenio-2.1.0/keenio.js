/**
 * Created by crunsh on 20.03.14.
 */

var Keen=Keen||{configure:function(e){this._cf=e},addEvent:function(e,t,n,i){this._eq=this._eq||[],this._eq.push([e,t,n,i])},setGlobalProperties:function(e){this._gp=e},onChartsReady:function(e){this._ocrq=this._ocrq||[],this._ocrq.push(e)}};(function(){var e=document.createElement("script");e.type="text/javascript",e.async=!0,e.src=("https:"==document.location.protocol?"https://":"http://")+"dc8na2hxrj29i.cloudfront.net/code/keen-2.1.0-min.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)})();

String.prototype.hashCode = function(){
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0, l = this.length; i < l; i++) {
        char  = this.charCodeAt(i);
        hash  = ((hash<<5)-hash)+char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

// Configure the Keen object with your Project ID and (optional) access keys.
Keen.configure({
    projectId: config.keenio.projectId,
    writeKey: config.keenio.writeKey, // required for sending events
    readKey: config.keenio.readKey    // required for doing analysis
});

// send a new rating
var accessoireRating = function (id, rating) {
    // create an event as a JS object
    var purchase = {
        id: id,
        rating: rating
    };

    // add it to the "purchases" collection
    Keen.addEvent("accessoires", purchase);
};

// send a new comment
var commentForm = function (id, data) {
    Keen.addEvent("comments", data);
}