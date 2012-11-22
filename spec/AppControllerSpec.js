var should = require('should')
    , mocha = require('mocha')
    , appController = require('../lib/AppController')

describe("AppController", function () {

    it("updates books by calling library functions", function (done) {
        var testObject = {

            update:function (book, callback) {

                book.Title.should.equal("Blue moon");
                book.Location.should.equal("silver bar");
                book.LoanedOut.should.be.true;

                var message = {
                    status:0,
                    message:"snorkle"
                };
                callback(message);
            }};


        var controller = appController(testObject);

        var body = {
            Title:"Blue moon",
            Location:"silver bar",
            LoanedOut:true
        };
        controller.update(body, function (message) {

            message.status.should.equal(0);
            message.message.should.equal("snorkle");
            done();
        });

    });

    it('finds all loaned out books.', function (done) {
        var testObject = {
            loanedOut:function (callback) {
                var message = {
                    status:0,
                    message:"OK",
                    books:[
                        {
                            Title:"My book",
                            Location:"Reilly",
                            LoanedOut:true,
                            ISBN:"1234"
                        }
                    ]
                }
                callback(message);
            }
        };

        var controller = appController(testObject);
        controller.loanedOut(function (message) {
            message.message.should.equal("OK");
            message.status.should.equal(0);
            done();
        })
    });

    it('finds all loaned out books and unencodes the "$".', function (done) {
        var testObject = {
            loanedOut:function (callback) {
                var message = {
                    status:0,
                    message:"OK",
                    books:[
                        {
                            Title:"My book has some $ $ signs.",
                            Location:"Reilly",
                            LoanedOut:true,
                            ISBN:"1234"
                        }
                    ]
                }
                callback(message);
            }
        };

        var controller = appController(testObject);
        controller.loanedOut(function (message) {
            message.message.should.equal("OK");
            message.status.should.equal(0);
            message.books[0].Title.should.equal("My book has some $ $ signs.");
            done();
        })
    });

    it('adds a new book.', function (done) {
        var testObject = {
            add:function (book, callback) {
                book.Title.should.equal("my new book");
                book.Subject.should.equal("subject about something");
                book.Author.should.equal('Bill Jones');
                book.ISBN.should.equal("1234567890");
                book.Location.should.equal("Nate");
                book.LoanedOut.should.be.true;

                var message = {
                    status:0,
                    message:"OK",
                    books:[]
                }
                callback(message);
            }
        }

        var controller = appController(testObject);

        var body = {
            Title:"my new book",
            Subject:"subject about something",
            Author:"Bill Jones",
            ISBN:"1234567890",
            Location:"Nate",
            LoanedOut:"true"
        }
        controller.add(body, function (message) {
            message.status.should.equal(0);
            message.message.should.equal("OK");
            message.books.should.eql([]);
            done();
        });

    });

    it('adds a new book sanitized for xss', function (done) {
        var testObject = {
            add:function (book, callback) {
                book.Title.should.equal("my new [removed]alert&#40;'Hi'&#41;[removed] book");
                book.Subject.should.equal("subject about $ something");
                book.Author.should.equal('Bill Jones');
                book.ISBN.should.equal("1234567890");
                book.Location.should.equal("Nate[removed]function(){}[removed]");
                book.LoanedOut.should.be.true;

                var message = {
                    status:0,
                    message:"OK",
                    books:[]
                }
                callback(message);
            }
        }

        var controller = appController(testObject);

        var body = {
            Title:"my new <script>alert('Hi')</script> book",
            Subject:"subject about $ something",
            Author:"Bill Jones",
            ISBN:"1234567890",
            Location:"Nate<script type='a'>function(){}</script>",
            LoanedOut:"true"
        }
        controller.add(body, function (message) {
            message.status.should.equal(0);
            message.message.should.equal("OK");
            message.books.should.eql([]);
            done();
        });

    });

    it('Returns all books.', function (done) {
        var testObject = {
            all:function (callback) {
                var message = {
                    status:0,
                    message:"OK",
                    books:[]
                }
                callback(message);
            }
        }

        var controller = appController(testObject);

        controller.all(function (message) {
            message.status.should.equal(0);
            message.message.should.equal("OK");
            message.books.should.eql([]);
            done();
        });

    });

    it('scrubs the data for searching before calling the db', function(done){
        var book = {
            Title:"my new [removed]alert&#40;'Hi'&#41;[removed] book",
            Subject:"subject about $ something",
            Author:"Bill Jones",
            ISBN:"1234567890",
            Location:"Nate<script type='a'>function(){}</script>",
            LoanedOut:"true"
        };

        var testObject = {
            search:function (c, callback) {

                c.should.equal('n[removed][removed]');

                var message = {
                    status:0,
                    message:"OK",
                    books:[book]
                }
                callback(message);
            }
        }

        var controller = appController(testObject);

        var body = {
            character: 'n<script></script>'
        }
        controller.search(body,function (message) {
            message.status.should.equal(0);
            message.message.should.equal("OK");
            message.books.should.eql([book]);
            done();
        });
    });
});