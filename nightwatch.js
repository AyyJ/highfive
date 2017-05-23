const SCREENSHOT_PATH = "./screenshots/";
const BINPATH = './node_modules/nightwatch/bin/';
const TRAVIS_JOB_NUMBER = process.env.TRAVIS_JOB_NUMBER;

const config = {
	"src_folders": [
		"test/e2e"
	],
	"output_folder": "./node_modules/nightwatch/reports",
	"test_workers": { "enabled": true, "workers": "auto" },
	"test_settings": {
		"default": {
			"launch_url": "http://ondemand.saucelabs.com:80",
			"selenium_port": 80,
			"selenium_host": "ondemand.saucelabs.com",
			"silent": true,
			"screenshots": {
				"enabled": true,
				"path": SCREENSHOT_PATH
			},
			"username": "adejesus",
			"access_key": "429e993c-8e67-43b3-9e25-4c4e71855846",
			"globals": {
				"waitForConditionTimeout": 10000
			},
			"desiredCapabilities": {
				"tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
				build: `build-${process.env.TRAVIS_JOB_NUMBER}`
			}
		},
		"chrome": {
			"desiredCapabilities": {
				"browserName": "chrome",
				"javascriptEnabled": true,
				"acceptSslCerts": true
			}
		},
		"chromemac": {
			"desiredCapabilities": {
				"browserName": "chrome",
				"platform": "OS X 10.11",
				"version": "47"
			}
		},
		"ie11": {
			"desiredCapabilities": {
				"browserName": "internet explorer",
				"platform": "Windows 10",
				"version": "11.0"
			}
		},
		"firefox": {
			"desiredCapabilities": {
				"platform": "XP",
				"browserName": "firefox",
				"version": "33"
			}
		},
		"internet_explorer_10": {
			"desiredCapabilities": {
				"platform": "Windows 7",
				"browserName": "internet explorer",
				"version": "10"
			}
		},
		"android_s4_emulator": {
			"desiredCapabilities": {
				"browserName": "android",
				"deviceOrientation": "portrait",
				"deviceName": "Samsung Galaxy S4 Emulator",
				"version": "4.4"
			}
		},
		"iphone_6_simulator": {
			"desiredCapabilities": {
				"browserName": "iPhone",
				"deviceOrientation": "portrait",
				"deviceName": "iPhone 6",
				"platform": "OSX 10.10",
				"version": "8.4"
			}
		}
	}
}
module.exports = config;
