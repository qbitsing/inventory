'use strict';

describe('Controller: NotificacionCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var NotificacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NotificacionCtrl = $controller('NotificacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NotificacionCtrl.awesomeThings.length).toBe(3);
  });
});
