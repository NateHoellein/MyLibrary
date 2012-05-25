
var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose')
  , library = require('./lib/mylibrary')
  , response = require('./lib/bookDefs')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  mongoose.connect('mongodb://localhost/book_test');
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.get('/', function(req, res){
    res.sendfile(__dirname + '/public/Main.html')
});

app.get('/add', function(req, res) {
    res.sendfile(__dirname + '/public/Add.html');
});

app.get('/library', function(req, res){
    library.all(function(response){
        console.log(response);
        (response.Status === 0) ? res.json(response.Books, 200) : res.json(response.Message, 409);
    })
})

app.get('/library/loanedOut', function(req, res){
    library.loanedOut(function(response){
        console.log(response);
        (response.Status === 0) ? res.json(response.Books, 200) : res.json(response.Message, 409);
    })
})

app.post('/add', function(req, res){
    var newBook = req.body;
    console.log(req.body);
    library.add(newBook, function(response){
        (response.Status === 0) ? res.json("OK", 200) : res.json(response.Message, 409);
    })

});
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
