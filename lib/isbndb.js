

var isbnDb = function() {

    var http = require('http')
    var libxmljs = require("libxmljs");

    var key = "NNNLLU92";

    var _bookInfo = function(isbn, callback) {

        var options = {
            host: "isbndb.com",
            port: 80,
            path: "/api/books.xml?access_key=NNNLLU92&index1=isbn&value1="+isbn,
            method: "GET"
        };

        var info = {};
        http.get(options, function(res){
            res.on('data', function(chunk) {
                try {
                    var doc = libxmljs.parseXmlString(chunk);
                    var title = doc.get('//TitleLong');
                    info.Title = (title) ? title.text() : "";

                    var author = doc.get('//AuthorsText');
                    info.Author = (author) ? author.text() : "";
                    info.Status = 0;
                    callback(info);
                } catch(e) {
                    info.Status = -1;
                    info.Message = e;
                    callback(info);
                }
            });
        }).on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
    };

    return {
        bookInfo: _bookInfo
    }
}();

module.exports = isbnDb;