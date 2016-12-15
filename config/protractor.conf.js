var SpecReporter = require('jasmine-spec-reporter');

module.exports = {
    allScriptsTimeout: 11000,
    specs: [
        './e2e/*.e2e-spec.ts'
    ],
    capabilities: {
        'browserName': 'chrome'
    },
    directConnect: true,
    baseUrl: 'http://dtapi.local',
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        print: function() {}
    },
    useAllAngular2AppRoots: true,
    onPrepare: function() {
        jasmine.getEnv().addReporter(new SpecReporter());
    }
};