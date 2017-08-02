'use strict';

describe('Service: BotonesTabla', function () {

  // load the service's module
  beforeEach(module('frontendApp'));

  // instantiate service
  var BotonesTabla;
  beforeEach(inject(function (_BotonesTabla_) {
    BotonesTabla = _BotonesTabla_;
  }));

  it('should do something', function () {
    expect(!!BotonesTabla).toBe(true);
  });

});
