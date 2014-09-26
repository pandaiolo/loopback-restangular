var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/\/spec\/.*\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

/* global requirejs */
requirejs.config({
  // Karma serves files from '/base'
  baseUrl: '/base',

  paths: {
    chai: 'bower_components/chai/chai',
    angular: 'bower_components/angular/angular',
    restangular: 'bower_components/restangular/dist/restangular',
    angularMocks: 'bower_components/angular-mocks/angular-mocks',
    lodash: 'bower_components/lodash/dist/lodash',
    given: 'test.e2e/given',
    util: 'test.e2e/util'
  },

  shim: {
    'angular': { exports : 'angular' },
    'restangular': {
      deps: ['angular', 'lodash'],
      exports: 'Restangular'
    },
    'angularMocks': {
      deps: ['angular'],
      exports: 'angular.mock'
    },
    'lodash': {
      exports: '_'
    },
    'chai': { exports: 'chai' }
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});

require(['chai'], function(chai) {
  window.expect = chai.expect;
});
