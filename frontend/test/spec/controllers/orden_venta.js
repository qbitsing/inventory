'use strict';

describe('Controller: OrdenVentaCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var OrdenVentaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenVentaCtrl = $controller('OrdenVentaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenVentaCtrl.awesomeThings.length).toBe(3);
  });
});
