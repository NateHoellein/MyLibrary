var should = require('should')
    , mocha = require('mocha')
    , isbnController = require('../lib/ISBNController')

describe('ISBNController', function () {

    it('searches for books by ISBN number', function (done) {
        var testObject = {
            bookInfo:function (isbnNumber, callback) {

                var message = {
                    status:0,
                    message:"OK",
                    books:[]
                };

                callback(message);
            }
        }

        var controller = isbnController(testObject);

        controller.bookInfo('1234', function(message){

            message.status.should.equal(0);
            message.message.should.equal("OK");
            message.books.should.eql([]);
            done();
        })

    });

    it('searches for books by ISBN number and scrubs input', function (done) {
        var testObject = {
            bookInfo:function (isbnNumber, callback) {

                isbnNumber.should.equal('12[removed][removed]34')
                var message = {
                    status:0,
                    message:"OK",
                    books:[]
                };

                callback(message);
            }
        }

        var controller = isbnController(testObject);

        controller.bookInfo('12<script></script>34', function(message){

            message.status.should.equal(0);
            message.message.should.equal("OK");
            message.books.should.eql([]);
            done();
        })

    });

});
