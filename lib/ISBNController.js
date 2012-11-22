var isbnController = function(isbndb){

    var sanitize = require('validator').sanitize;
    var _isbndb = isbndb;

    var _bookInfo = function(isbn, callback){

        var cleaned = sanitize(isbn).xss();
        _isbndb.bookInfo(cleaned,function(message) {
            callback(message);

        });
    };

    return {
        bookInfo: _bookInfo
    }
};

module.exports = isbnController;
