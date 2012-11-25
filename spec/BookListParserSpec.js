var isbndbparser = require('../lib/isbndbparser')


describe('isbndb book response', function(){
    it('parses a sucessful response', function(done){

        var response = "<ISBNdb server_time='2012-11-22T16:20:52Z'> \
                           <BookList total_results='1' page_size='10' page_number='1' shown_results='1'> \
                            <BookData book_id='programming_challenges' isbn='0387001638' isbn13='9780387001630'> \
                                <Title>Programming challenges</Title>\
                                <TitleLong>Programming challenges: the programming contest training manual</TitleLong> \
                                <AuthorsText>Steven S. Skiena, Miguel A. Revilla</AuthorsText>\
                                <PublisherText publisher_id='springer'>New York : Springer, c2003.</PublisherText>\
                            </BookData>\
                           </BookList>\
                          </ISBNdb>";


        isbndbparser.parse(response, function(message){
            message.status.should.equal(0);
            message.message.should.equal("Found!");
            message.books[0].Title.should.equal("Programming challenges: the programming contest training manual");
            message.books[0].Author.should.equal("Steven S. Skiena, Miguel A. Revilla");

            done();
        });
    });

    it('parses a result with no book found.', function(done){

        var response = "<ISBNdb server_time='2012-11-25T14:49:30Z'> \
        <BookList total_results='0' page_size='10' page_number='1' shown_results='0'/> \
            </ISBNdb>";

        isbndbparser.parse(response, function(message){
            message.status.should.equal(0);
            message.message.should.equal("No books found");
            message.books.length.should.equal(0);
            done();
        });
    });
});
