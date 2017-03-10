'use strict';

describe('Controller: RestaurarCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var RestaurarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RestaurarCtrl = $controller('RestaurarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RestaurarCtrl.awesomeThings.length).toBe(3);
  });
});
