// Karma configuration
// Generated on 2017-03-03

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      '../bower_components/materialize/bin/materialize.js',
      '../bower_components/angular/angular.js',
      '../bower_components/angular-animate/angular-animate.js',
      '../bower_components/angular-aria/angular-aria.js',
      '../bower_components/angular-messages/angular-messages.js',
      '../bower_components/angular-resource/angular-resource.js',
      '../bower_components/angular-ui-router/release/angular-ui-router.js',
      '../bower_components/angular-sanitize/angular-sanitize.js',
      '../bower_components/angular-touch/angular-touch.js',
      '../bower_components/rangy/rangy-core.js',
      '../bower_components/rangy/rangy-classapplier.js',
      '../bower_components/rangy/rangy-highlighter.js',
      '../bower_components/rangy/rangy-selectionsaverestore.js',
      '../bower_components/rangy/rangy-serializer.js',
      '../bower_components/rangy/rangy-textrange.js',
      '../bower_components/textAngular/dist/textAngular.js',
      '../bower_components/textAngular/dist/textAngular-sanitize.js',
      '../bower_components/textAngular/dist/textAngularSetup.js',
      '../bower_components/perfect-scrollbar/src/perfect-scrollbar.js',
      '../bower_components/angular-perfect-scrollbar-4.1.1fixed/src/angular-perfect-scrollbar.js',
      '../bower_components/moment/moment.js',
      '../bower_components/fullcalendar/dist/fullcalendar.js',
      '../bower_components/angular-ui-calendar/src/calendar.js',
      '../bower_components/chart.js/dist/Chart.js',
      '../bower_components/angular-chart.js/dist/angular-chart.js',
      '../bower_components/d3/d3.js',
      '../bower_components/c3/c3.js',
      '../bower_components/c3-angular/c3-angular.min.js',
      '../bower_components/angular-loading-bar/build/loading-bar.js',
      '../bower_components/angular-growl-v2/build/angular-growl.js',
      '../bower_components/angular-growl-notifications/dist/angular-growl-notifications.js',
      '../bower_components/angular-cookies/angular-cookies.js',
      '../bower_components/angular-local-storage/dist/angular-local-storage.js',
      '../bower_components/angular-ui-grid/ui-grid.js',
      '../bower_components/angular-ui-grid/ui-grid.min.js',
      '../bower_components/ui-cropper/compile/minified/ui-cropper.js',
      '../bower_components/angular-materialize/src/angular-materialize.js',
      '../bower_components/angular-barcode/dist/angular-barcode.min.js',
      '../bower_components/angular-io-barcode/build/angular-io-barcode.js',
      '../bower_components/sweetalert/dist/sweetalert.min.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
