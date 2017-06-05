'use strict';

describe('Service: SesionUsuario', function () {

  // load the service's module
  beforeEach(module('frontendApp'));

  // instantiate service
  var SesionUsuario;
  beforeEach(inject(function (_SesionUsuario_) {
    SesionUsuario = _SesionUsuario_;
  }));

  it('should do something', function () {
    expect(!!SesionUsuario).toBe(true);
  });

});
