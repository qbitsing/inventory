'use strict';

describe('Controller: FabricacionCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var FabricacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FabricacionCtrl = $controller('FabricacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FabricacionCtrl.awesomeThings.length).toBe(3);
  });
});
