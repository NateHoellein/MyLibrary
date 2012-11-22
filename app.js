var express = require('express')
    , routes = require('./routes')
    , library = require('./lib/mylibrary')
    , response = require('./lib/bookDefs')
    , isbnDb = require('./lib/isbndb')
    , appController = require('./lib/AppController')
    , check = require('validator').check
    , sanitize = require('validator').sanitize
    , controller;

var app = module.exports = express.createServer();
// Configuration

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
    library.init('localhost/book_test');
    controller = appController(library);
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/Main.html')
});

app.get('/add', function (req, res) {
    res.sendfile(__dirname + '/public/Add.html');
});

app.get('/search', function (req, res) {
    res.sendfile(__dirname + '/public/Search.html')
});

app.get('/library', function (req, res) {
    library.all(function (response) {
        (response.Status === 0) ? res.json(response.Books, 200) : res.json(response.Message, 409);
    })
})

app.get('/library/loanedOut', function (req, res) {
    controller.loanedOut(function (response) {
        (response.Status === 0) ? res.json(response.Books, 200) : res.json(response.Message, 409);
    })
})

app.post('/library/search', function (req, res) {
    var character = req.body.character;
    var cleanCharacter = sanitize(character).xss();
    library.search(cleanCharacter, function (response) {
        (response.Status === 0) ? res.json(response.Books, 200) : res.json(response.Message, 409);
    })
});

app.post('/add', function (req, res) {

    controller.add(req.body, function (response) {
        (response.Status === 0) ? res.json("OK", 200) : res.json(response.Message, 409);
    })
});

app.post('/library/isbn', function (req, res) {
    var isbn = req.body.isbn;
    var cleanIsbn = sanitize(isbn).xss();
    isbnDb.bookInfo(cleanIsbn, function (bookInfo) {
        (bookInfo.Status === 0) ? res.json(bookInfo, 200) : res.json(response.Message, 409);
    });
});

app.post('/library/update', function (req, res) {
    controller.update(req.body, function (response) {
        (response.Status === 0) ? res.json("OK", 200) : res.json(response.Message, 409);
    })
})
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
