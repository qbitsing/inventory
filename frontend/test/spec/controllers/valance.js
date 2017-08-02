'use strict';

describe('Controller: ValanceCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var ValanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ValanceCtrl = $controller('ValanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ValanceCtrl.awesomeThings.length).toBe(3);
  });
});
