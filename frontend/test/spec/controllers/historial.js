'use strict';

describe('Controller: HistorialCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var HistorialCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HistorialCtrl = $controller('HistorialCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HistorialCtrl.awesomeThings.length).toBe(3);
  });
});
