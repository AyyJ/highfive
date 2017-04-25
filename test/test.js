var assert = require('assert');
var index = require('../functions/index.js');  // our module

describe("Valid Phone and Format Phone", function() {
  describe("phone number is valid", function() {

    it("says it's valid", function() {
        var phoneNumber = "1231231230";
        var response = index.test_validatePhone(phoneNumber);

        assert.equal(response, true);
    });

  	it("Invalid formatted phone #", function() {

    });

    it("Check against nonsense", function() {

    });
  });

});
