    var form = document.getElementById("comment");

    form.onsubmit = function (e) {
        // stop the regular form submission
        e.preventDefault();

        // collect the form data while iterating over the inputs
        var data = {};
        for (var i = 0, ii = form.length; i < ii; ++i) {
            var input = form[i];
            console.log(input);
            if (input.name) {
                data[input.name] = input.value;
            }
        }

        commentForm("comments", data);
    };

    var options = {
        valueNames: ['date', 'title', 'tags']
    };

    var entryList = new List('entry-list', options);