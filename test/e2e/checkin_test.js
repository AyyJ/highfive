var config = require('../../nightwatch.js');

module.exports = { // adapted from: https://git.io/vodU0
  'HighFive Check In Test': function(browser) {
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
        .click('div.dropdown')
        .pause(1000)
        .click('a[href="/checkin"]')
        .pause(1000)
        .assert.title('Check In')
        .pause(1000)
        .click('div#tap-to-check')
        .pause(1000)
        .setValue('input[name="first"]', 'Kevin')
        .setValue('input[name="last"]', 'Durant')
        .setValue('input[name="phoneNumber"]', '858-534-2230')
        .pause(2000)
        .click('input')
        .pause(2000)
        .end();
    },
};
