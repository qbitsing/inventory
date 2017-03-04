'use strict';

describe('Controller: ProveedoresCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var ProveedoresCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProveedoresCtrl = $controller('ProveedoresCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProveedoresCtrl.awesomeThings.length).toBe(3);
  });
});
