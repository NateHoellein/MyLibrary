var mylibrary = function() {

    var mongoose = require('mongoose');
    var Schema = require('mongoose').Schema;
    var objectId = require('mongoose').Types.ObjectId;
    var recordStatus = require(__dirname + '/recordStatus');
    var sanitize = require('validator').sanitize;
    var connection, model;

    var bookModel = new Schema({
        Title: String,
        Author: String,
        ISBN: String,
        Subject: String,
        Location: String,
        LoanedOut: Boolean
    });

    function handleResponse(error, docs, callback) {
        (error) ? callback(setMessage("Oh snap, something went wrong: " + err, -1)) : callback(setMessage("OK", 0, docs));
    };

    function setMessage(message, status, books) {
        recordStatus.Message = message;
        recordStatus.Books = books;
        recordStatus.Status = status;
        return recordStatus;
    };

    // add callback and timer if db is in connecting status.  Wait for ?? seconds then call callback.
    var _init = function(uri, status) {
        connection = mongoose.createConnection('mongodb://' + uri);
        console.log('in _init db ready? ' + connection.readyState);

        connection.on('open', function() {
            console.log('open event: ');
        });

        connection.on('disconnected', function(object){
            console.log('db disconnected: ' + object);
        })

        model = connection.model('books', bookModel);
    };

    var _add = function(book, callback) {
        var newBook = new model({
            Title: sanitize(book.Title).xss(),
            Author: sanitize(book.Author).xss(),
            ISBN: sanitize(book.ISBN).xss(),
            Subject: sanitize(book.Subject).xss(),
            Location: sanitize(book.Location).xss(),
            LoanedOut: (sanitize(book.LoanedOut.toLowerCase()).xss() === 'true')
        });
        console.log("mylibrary " + newBook);
        model.find({Title: newBook.Title}, function(err, docs){
            if(err) {
                callback(setMessage("Oh snap, something went wrong: " + err, -1));
            } else if(docs.length > 0) {
                callback(setMessage("Oh snap, " + newBook.Title + " already exists.", 1));
            } else {
                newBook.save(function(err){
                    handleResponse(err, callback);
                })
            }
        })

    };

    var _all = function(callback) {
        model.find(function(err,docs){
            handleResponse(err, docs, callback);
        })
    };

    var _loanedOut = function(callback) {
        console.log('in loaned out, db ready? ' + connection.readyState);
        if(connection.readyState === 0) {
            console.log('connection ready state is 0, re-opening.')
            connection.open('localhost', 'books_test', function(status) {
                console.log('status of connection.open: ' + status);
            });
        }
        console.log('model db: ' + model.db.name);
        model.find({LoanedOut: true}, function(err, docs) {
            console.log('loaned out err: ' + err);
            handleResponse(err,docs,callback);
        })
    }

    var _search = function(character, callback){
        var regex = new RegExp(character);

        model.find({$or: [{Title: regex},{Author: regex}]}  , function(err, docs){
            handleResponse(err, docs, callback);
        })
    }

    var _update = function(book, callback) {
        var query = {Title: book.Title};
        model.update(query, {$set: {Location: book.Location,LoanedOut: (book.LoanedOut.toLowerCase() === 'true') }},function(err,numEffected) {
            handleResponse(err, docs, callback);
        });
    };

    function dumpProps(obj) {
        for (var i in obj) {
            console.log('o: ' +obj[i]);
            if (typeof obj[i] == "object") {
                dumpProps(obj[i]);
            }
        }
    }

    return {
        add: _add,
        all: _all,
        loanedOut: _loanedOut,
        //delete: _delete,
        update: _update,
        search: _search,
        init: _init
    }
}();

module.exports = mylibrary;