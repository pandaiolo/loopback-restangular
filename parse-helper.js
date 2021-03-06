/*!
 * Parsers for extracting data from the generated lb-service.js code.
 * Used by unit-tests in grunt-loopback-restangular
 */

var expect = require('chai').expect;

function parse(script, regex) {
  expect(script).to.match(regex);
  return regex.exec(script)[1] || '';
}

exports.moduleName = function(script) {
  return parse(script, /.*angular\.module\("([^"]*)",.*/);
};

exports.baseUrl = function(script) {
  return parse(script, /Restangular.setBaseUrl("([^"]*)");/);
};
