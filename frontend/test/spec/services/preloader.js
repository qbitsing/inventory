'use strict';

describe('Service: preloader', function () {

  // load the service's module
  beforeEach(module('frontendApp'));

  // instantiate service
  var preloader;
  beforeEach(inject(function (_preloader_) {
    preloader = _preloader_;
  }));

  it('should do something', function () {
    expect(!!preloader).toBe(true);
  });

});
