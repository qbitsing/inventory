'use strict';

describe('Service: numeroaletras', function () {

  // load the service's module
  beforeEach(module('frontendApp'));

  // instantiate service
  var numeroaletras;
  beforeEach(inject(function (_numeroaletras_) {
    numeroaletras = _numeroaletras_;
  }));

  it('should do something', function () {
    expect(!!numeroaletras).toBe(true);
  });

});
