

var isbnDb = function() {

    var http = require('http')
    var libxmljs = require("libxmljs");

    var _bookInfo = function(isbn, callback) {

        var options = {
            host: "isbndb.com",
            port: 80,
            path: "/api/books.xml?access_key=NNNLLU92&index1=isbn&value1="+isbn,
            method: "GET"
        };


        http.get(options, function(res){
            res.on('data', function(chunk) {

                var info = {};
                try {
                    var book = {};
                    var doc = libxmljs.parseXmlString(chunk);

                    var found = doc.get('/ISBNdb/BookList[total_results]');

                    var title = doc.get('//Title');
                    var titleLong = doc.get('//TitleLong');
                    console.log("title: " + title + " titleLong " + titleLong);
                    var t = (title) ? title.text() : "";
                    var tl = (titleLong) ? titleLong.text() : "";

                    book.Title = (tl) ? tl : t;

                    var author = doc.get('//AuthorsText');
                    book.Author = (author) ? author.text() : "";

                    info.Status = 0;
                    info.message = 'Found!'
                    info.books = [book];
                    callback(info);
                } catch(e) {
                    info.Status = -1;
                    info.Message = e;
                    callback(info);
                }
            });
        }).on('error', function(e) {
                var message = 'problem with request: ' + e.message;
                console.log(message);
                callback(message);
        });
    };

    return {
        bookInfo: _bookInfo
    }
}();

module.exports = isbnDb;