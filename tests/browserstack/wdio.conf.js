const browserStackConfig = require('./browserstack.config');

const date = new Date();
const dateForDisplay = date.toDateString();
const buildNameForDisplay = `${browserStackConfig.BUILD}: ${dateForDisplay}`;

exports.config = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,
  updateJob: false,
  specs: [
    './specs/ballotMainTest.js',
  ],
  twitterUserName: browserStackConfig.TWITTER_USER_NAME,
  twitterPassword: browserStackConfig.TWITTER_PASSWORD,
  exclude: [],
  capabilities: [
    {
      name: 'ballotMainTest: Windows 10',
      build: buildNameForDisplay,
      os: 'Windows',
      os_version: '10',
      browserName: 'Chrome',
      browser_version: 80.0,
      real_mobile: false,
      acceptSslCerts: true,
      'browserstack.console': 'info',
      'browserstack.local': false,
      'browser.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: false,
      isIOS: false,
      isMobileScreenSize: false,
    },
    {
      name: 'ballotMainTest: Windows 8.1',
      build: buildNameForDisplay,
      os: 'Windows',
      os_version: '8.1',
      browserName: 'Chrome',
      browser_version: 79.0,
      real_mobile: false,
      acceptSslCerts: true,
      'browserstack.console': 'info',
      'browserstack.local': false,
      'browser.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: false,
      isIOS: false,
      isMobileScreenSize: false,
    },
    {
      name: 'ballotMainTest: Windows 7',
      build: buildNameForDisplay,
      os: 'Windows',
      os_version: '7',
      browserName: 'Chrome',
      browser_version: 81.0,
      real_mobile: false,
      acceptSslCerts: true,
      'browserstack.console': 'info',
      'browserstack.local': false,
      'browser.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: false,
      isIOS: false,
      isMobileScreenSize: false,
    },
    {
      name: 'ballotMainTest: OS X Catalina',
      build: buildNameForDisplay,
      os: 'OS X',
      os_version: 'Catalina',
      browserName: 'Safari',
      browser_version: 13.0,
      real_mobile: false,
      acceptSslCerts: true,
      'browserstack.console': 'info',
      'browserstack.local': false,
      'browser.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: false,
      isIOS: false,
      isMobileScreenSize: false,
    },
    {
      name: 'ballotMainTest: OS X Mojave',
      build: buildNameForDisplay,
      os: 'OS X',
      os_version: 'Mojave',
      browserName: 'Chrome',
      browser_version: 70.0,
      real_mobile: false,
      acceptSslCerts: true,
      'browserstack.console': 'info',
      'browserstack.local': false,
      'browser.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: false,
      isIOS: false,
      isMobileScreenSize: false,
    },
  ],
  webviewConnectTimeout: 90000,
  baseUrl: browserStackConfig.WEB_APP_ROOT_URL,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  reporters: ['concise'],

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 360000,
  },
}
