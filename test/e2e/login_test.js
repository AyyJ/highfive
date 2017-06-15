var config = require('../../nightwatch.js');

module.exports = { // adapted from: https://git.io/vodU0
  'HighFive Login Test': function(browser) {
      browser
        .url('http://cse112-highfive-staging.herokuapp.com/index')
        .waitForElementVisible('body')
        .assert.title('Echelon')
        .pause(1000)
        .click('a[href="login"]')
        .assert.title('Echelon | Login')
        .pause(1000)
        .setValue('input[type=text]', 'tester@test.com')
        .setValue('input[type=password]', 'cse112')
        .click('button[id=loginButton]')
        .pause(4000)
        .assert.title('Echelon | Visitors')
        .pause(1000)
        .end();
    },
};
