var should = require('should');
var request = require('supertest');
var validPhone = require('../routes/validPhone.js');
var formatPhone = require('../routes/formatPhone.js');

describe('Phone Number Validity Check', function() {
    var url = "localhost:4941";
		var goodPhone = "1231231234";
		var badPhone = "123";


    it("Pass a good phone number", function(done) {
        request(url)
            .get('/validPhone?phoneNumber=' + goodPhone)
            .expect(200)
            .end(function(err,res){
              res.body.should.have.property('err');
              res.body.err.should.equal(false);
              done();
            });
    });

    it("Pass a bad phone", function(done) {
        request(url)
        .get('/validPhone?phoneNumber=' + badPhone)
        .expect(200)
        .end(function(err,res){
          res.body.should.have.property('err');
          res.body.err.should.equal(true);
          done();
        });
    });
});
