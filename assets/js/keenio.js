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
    projectId: "532b3e5a00111c0da1000006",
    writeKey: "d2d5667c13e7a222cb7fefa8c1d0fb3c2c67b212b20bd4940cb781c3ae6d2bf47be8fddb5f18da85fb911edc931e9311144b4f638f890fb95be54bf9075d3960d2e48dda216f5262bd81a5d39c5a54934370b2f5ef9c5664107473738b0bea149f46dc586e7bed6a9007dfb0fff22fc5", // required for sending events
    readKey: "fca64cb411fe523d053f2d9b1d159011135be6ce55da682f1ad8d6b1d4f629b84dd564edb1c0d7a0d7575ebaaa79b55daa075f7c866d7430ace403bab51b7513aa41b30ce443f9d736d45d33c78a0b44420c2ecd35223b76d67af37df1d0cc52bf67e73cb32d949eb58cb5814e7e5e6a"    // required for doing analysis
    });

var accessoireRating = function (id, rating) {
    // create an event as a JS object
    var purchase = {
        id: id,
        rating: rating
    };

    // add it to the "purchases" collection
    Keen.addEvent("accessoires", purchase);
};
