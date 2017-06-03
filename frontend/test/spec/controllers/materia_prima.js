'use strict';

describe('Controller: MateriaPrimaCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var MateriaPrimaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriaPrimaCtrl = $controller('MateriaPrimaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MateriaPrimaCtrl.awesomeThings.length).toBe(3);
  });
});
