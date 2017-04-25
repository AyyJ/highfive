var assert = require('assert');
var index = require('../functions/index.js');  // our module

describe("Valid Phone and Format Phone", function() {
  describe("Check if Valid Phone Number", function() {

    it("Valid Phone Number", function() {
        var phoneNumber = "1231231230";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, true);
    });

    it("Valid Phone Number", function() {
        var phoneNumber = "(123)456-7890";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, true);
    });

    it("Valid Phone Number", function() {
        var phoneNumber = "(123)4567890";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, true);
    });

    it("Valid Phone Number", function() {
        var phoneNumber = "123456-7890";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, true);
    });

    it("Weird Valid Phone Number", function() {
        var phoneNumber = "123-456-7890";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, true);
    });

  	it("Invalid Phone Number", function() {
        var phoneNumber = "123123123";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, false);
    });

    it("Invalid Phone Number", function() {
        var phoneNumber = "12312e123";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, false);
    });
  });
  describe("Check Format", function() {

    it("Correct Formatted Number", function() {
        var phoneNumber = "1231231230";
        var response = index.test_format(phoneNumber);

        assert.equal(response, "(123) 123-1230");
    });

    it("Correct Formatted Number", function() {
        var phoneNumber = "(123)1231230";
        var response = index.test_format(phoneNumber);

        assert.equal(response, "(123) 123-1230");
    });
  });

});
