'use strict';

describe('Service: Tabla', function () {

  // load the service's module
  beforeEach(module('frontendApp'));

  // instantiate service
  var Tabla;
  beforeEach(inject(function (_Tabla_) {
    Tabla = _Tabla_;
  }));

  it('should do something', function () {
    expect(!!Tabla).toBe(true);
  });

});
