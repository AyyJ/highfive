var config = require('../../nightwatch.conf.BASIC.js');

module.exports = { // adapted from: https://git.io/vodU0
  'Guinea Pig Assert Title': function(browser) {
    browser
      .url('https://cse112-highfive.herokuapp.com/')
      .waitForElementVisible('body')
      .assert.title('High Five Landing Page')
      //.saveScreenshot('guinea-pig-test.png')
      .pause(1000)
      .end();
  }
};
