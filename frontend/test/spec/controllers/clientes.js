'use strict';

describe('Controller: ClientesCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var ClientesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClientesCtrl = $controller('ClientesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ClientesCtrl.awesomeThings.length).toBe(3);
  });
});
