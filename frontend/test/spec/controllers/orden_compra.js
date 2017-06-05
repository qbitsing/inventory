'use strict';

describe('Controller: OrdenCompraCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var OrdenCompraCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenCompraCtrl = $controller('OrdenCompraCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenCompraCtrl.awesomeThings.length).toBe(3);
  });
});
