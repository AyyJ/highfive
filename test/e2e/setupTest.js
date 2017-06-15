var config = require('../../nightwatch.js');

module.exports = { // adapted from: https://git.io/vodU0
  'HighFive Trivial Body Test': function(browser) {
    browser
      .url('http://cse112-highfive-staging.herokuapp.com/')
      .waitForElementVisible('body')
      .assert.title('High Five Landing Page')
      .pause(1000)
     // .end();
    },
//module.exports = { // adapted from: https://git.io/vodU0
    'HighFive Signup Body Test': function(browser) {
      browser
        .url('http://cse112-highfive-staging.herokuapp.com/index')
        .waitForElementVisible('body')
        .assert.title('Echelon')
        .pause(1000)
        .click('a[href="signup"]')
        .assert.title('Echelon | Signup')
        .pause(1000)
        .end();
    }
};
