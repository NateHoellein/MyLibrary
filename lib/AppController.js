var appController = function (library) {

    var sanitize = require('validator').sanitize;
    var _library = library;


    var _update = function (body, callback) {

        var book = {
            Title: body.Title,
            Location: body.Location,
            LoanedOut: body.LoanedOut
        };

        _library.update(book, function(message){
            callback(message);
        })
    };

    var _loanedOut = function(callback){
        _library.loanedOut(function(message){
            callback(message);
        })
    };

    var _add = function(body, callback){

        var book = {
            Title: _scrub(body.Title),
            Author: _scrub(body.Author),
            Subject: _scrub(body.Subject),
            ISBN: _scrub(body.ISBN),
            Location: _scrub(body.Location),
            LoanedOut: _scrub(body.LoanedOut).toLowerCase() === 'true'
        };

        _library.add(book, function(message){
            callback(message);
        })
    };

    var _all = function(callback){
        _library.all(function(message){
            callback(message);
        });
    };

    var _scrub = function(value){
        return sanitize(value).xss();
    };

    return {
        update: _update,
        loanedOut: _loanedOut,
        add: _add,
        all: _all
    }

};

module.exports = appController;
