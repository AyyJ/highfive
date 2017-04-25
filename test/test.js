var assert = require('assert');
var index = require('../functions/index.js');  // our module

describe("Valid Phone and Format Phone", function() {
  describe("Check if Valid Phone Number", function() {

    it("Valid Phone Number: only digits", function() {
        var phoneNumber = "1231231230";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, true);
    });

    it("Valid Phone Number: parentheses, 1 dash", function() {
        var phoneNumber = "(123)456-7890";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, true);
    });

    it("Valid Phone Number: parentheses, no dash", function() {
        var phoneNumber = "(123)4567890";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, true);
    });

    it("Valid Phone Number: no parentheses, properly placed latter dash", function() {
        var phoneNumber = "123456-7890";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, true);
    });

    it("Weird Valid Phone Number: no parentheses, 2 dashes", function() {
        var phoneNumber = "123-456-7890";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, true);
    });

  	it("Invalid Phone Number: too short", function() {
        var phoneNumber = "123123123";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, false);
    });

    it("Invalid Phone Number: non-digit present", function() {
        var phoneNumber = "12312e123";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, false);
    });
    it("Invalid Phone Number: too long", function() {
        var phoneNumber = "1234567890123";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, false);
    });
    it("Invalid Phone Number: Incomplete left parentheses", function() {
        var phoneNumber = "123)456-7890";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, false);
    });
    it("Invalid Phone Number: Incomplete right parentheses", function() {
        var phoneNumber = "(123456-7890";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, false);
    });
    it("Invalid Phone Number: no parentheses, too many dashes", function() {
        var phoneNumber = "1-2-3-4-5-6-7-8-9-0";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, false);
    });
    it("Invalid Phone Number: parentheses, too many dashes", function() {
        var phoneNumber = "(123)456-----7890";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, false);
    });
  });
  
  describe("Check Format", function() {

    it("Correct Formatted Number: only digits", function() {
        var phoneNumber = "1231231230";
        var response = index.test_format(phoneNumber);

        assert.equal(response, "(123) 123-1230");
    });

    it("Correct Phone Number: parentheses, 1 dash", function() {
        var phoneNumber = "(123)456-7890";
        var response = index.test_format(phoneNumber);

        assert.equal(response, "(123) 456-7890");
    });

    it("Correct Phone Number: no parentheses, properly placed latter dash", function() {
        var phoneNumber = "123456-7890";
        var response = index.test_format(phoneNumber);

        assert.equal(response, "(123) 456-7890");
    });

    it("Weird Valid Phone Number: no parentheses, 2 dashes", function() {
        var phoneNumber = "123-456-7890";
        var response = index.test_format(phoneNumber);

        assert.equal(response, "(123) 456-7890");
    });


  });

});
