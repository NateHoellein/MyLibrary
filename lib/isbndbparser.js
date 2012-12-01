var libxmljs = require("libxmljs");

var isbndbparser = function () {


    var _parse = function (xmlResponse, callback) {
        var myStatus = {
            Status:0,
            Message:"",
            Books:[]
        };

        try {
            var doc = libxmljs.parseXmlString(xmlResponse);
            var found = doc.get('/ISBNdb/BookList');

            if (found.attr('total_results').value() === "1") {
                var title = doc.get('//Title');
                var titleLong = doc.get('//TitleLong');
                var t = (title) ? title.text() : "";
                var tl = (titleLong) ? titleLong.text() : "";

                var author = doc.get('//AuthorsText');

                var book = {
                    Title:(tl) ? tl : t,
                    Author:(author) ? author.text() : ""
                }

                myStatus.Message = "Found!";
                myStatus.Status = 0;
                myStatus.Books.push(book);

            } else {
                myStatus.Message = "No books found";
                myStatus.Status = 0;
            }
        }
        catch (e) {
            myStatus.Message = "Aw, snap an error occurred parsing the response. " + e;
            myStatus.Status = 0;
        }

        callback(myStatus);
    };

    return {
        parse:_parse
    };
}();

module.exports = isbndbparser;
