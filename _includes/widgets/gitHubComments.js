var tags = [ 'tag1', 'tag2', 'tag3' ];


function getTag() {
return tags[Math.floor(Math.random() * tags.length)];
}

$(document).ready(function() {
$("#tagline").text(getTag());
});