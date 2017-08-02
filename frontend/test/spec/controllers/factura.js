'use strict';

describe('Controller: FacturaCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var FacturaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FacturaCtrl = $controller('FacturaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FacturaCtrl.awesomeThings.length).toBe(3);
  });
});
