var config = require('../../nightwatch.js');

module.exports = { // adapted from: https://git.io/vodU0
  'HighFive Trivial Body Test': function(browser) {
    browser
      .url('https://cse112-highfive.herokuapp.com/')
      .waitForElementVisible('body')
      .assert.title('High Five Landing Page')
      .pause(1000)
      .end();
  }
};
