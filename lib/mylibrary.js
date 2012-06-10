var mylibrary = function() {

    var mongoose = require('mongoose');
    var Schema = require('mongoose').Schema;
    var objectId = require('mongoose').Types.ObjectId;
    var recordStatus = require(__dirname + '/recordStatus');

    var bookModel = new Schema({
        Title: String,
        Author: String,
        ISBN: String,
        Subject: String,
        Location: String,
        LoanedOut: Boolean
    });

    var model = mongoose.model('books', bookModel);

    function setMessage(message, status, books) {
        recordStatus.Message = message;
        recordStatus.Books = books;
        recordStatus.Status = status;
        return recordStatus;
    }

    var _add = function(book, callback) {
        var newBook = new model({
            Title: book.Title,
            Author: book.Author,
            ISBN: book.ISBN,
            Subject: book.Subject,
            Location: book.Location,
            LoanedOut: (book.LoanedOut.toLowerCase() === 'true')
        });
        console.log("mylibrary " + newBook);
        model.find({Title: newBook.Title}, function(err, docs){
            if(err) {
                callback(setMessage("Oh snap, something went wrong: " + err, -1));
            } else if(docs.length > 0) {
                callback(setMessage("Oh snap, " + newBook.Title + " already exists.", 1));
            } else {
                newBook.save(function(err){
                    (err) ? callback(setMessage("Oh snap, something went wrong: " + err, -1)) : callback(setMessage("OK", 0));
                })
            }
        })

    };

    var _all = function(callback) {
        model.find(function(err,docs){
            (err) ? callback(setMessage("Oh snap, something went wrong: " + err, -1)) :callback(setMessage("OK", 0, docs))
        })
    };

    var _loanedOut = function(callback) {
        model.find({LoanedOut: true}, function(err, docs) {
            (err) ? callback(setMessage("Oh snap, something went wrong: " + err, -1)) :callback(setMessage("OK", 0, docs))
        })
    }

    var _search = function(character, callback){
        var regex = new RegExp(character);
        model.find({$or: [{Title: regex},{Author: regex}]}  , function(err, docs){
            (err) ? callback(setMessage("Oh snap, something went wrong: " + err, -1)) :callback(setMessage("OK", 0, docs))
        })
    }

    var _update = function(book, callback) {
        var query = {Title: book.Title};
        model.update(query, {$set: {Location: book.Location,LoanedOut: (book.LoanedOut.toLowerCase() === 'true') }},function(err,numEffected) {
            (err) ? callback(setMessage("Oh snap, something went wrong: " + err, -1)) : callback(setMessage("OK",0, numEffected))
        });
    };

    return {
        add: _add,
        all: _all,
        loanedOut: _loanedOut,
        //delete: _delete,
        update: _update,
        search: _search
    }
}();

module.exports = mylibrary;