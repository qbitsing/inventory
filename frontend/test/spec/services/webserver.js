'use strict';

describe('Service: webServer', function () {

  // load the service's module
  beforeEach(module('frontendApp'));

  // instantiate service
  var webServer;
  beforeEach(inject(function (_webServer_) {
    webServer = _webServer_;
  }));

  it('should do something', function () {
    expect(!!webServer).toBe(true);
  });

});
