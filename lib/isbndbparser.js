var libxmljs = require("libxmljs");

var isbndbparser = function () {


    var _parse = function (xmlResponse, callback) {
        var myStatus = {
            status: 0,
            message: "",
            books: []
        };

        var title, author, book;

        var doc = libxmljs.parseXmlString(xmlResponse);
        var found = doc.get('/ISBNdb/BookList');

        if (found.attr('total_results').value() === "1") {
            title = doc.get('//Title');
            var titleLong = doc.get('//TitleLong');
            var t = (title) ? title.text() : "";
            var tl = (titleLong) ? titleLong.text() : "";

            author = doc.get('//AuthorsText');

            book = {
                Title:(tl) ? tl : t,
                Author:(author) ? author.text() : ""
            }

            myStatus.message = "Found!";
            myStatus.status = 0;
            myStatus.books.push(book);

        } else {
            myStatus.message = "No books found";
            myStatus.status = 0;
        }

        callback(myStatus);
    };

    return {
        parse:_parse
    };
}();

module.exports = isbndbparser;
