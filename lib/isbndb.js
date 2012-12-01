

var isbnDb = function() {

    var http = require('http')
    var libxmljs = require("libxmljs");
    var parser = require("./isbndbparser");

    var _bookInfo = function(isbn, callback) {

        var options = {
            host: "isbndb.com",
            port: 80,
            path: "/api/books.xml?access_key=NNNLLU92&index1=isbn&value1="+isbn,
            method: "GET"
        };

        http.get(options, function(res){
            res.on('data', function(chunk) {

                parser.parse(chunk, function(response){
                    callback(response);
                });
            });
        });
    };

    return {
        bookInfo: _bookInfo
    }
}();

module.exports = isbnDb;