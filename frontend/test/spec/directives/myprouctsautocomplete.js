'use strict';

describe('Directive: myProuctsAutoComplete', function () {

  // load the directive's module
  beforeEach(module('frontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-proucts-auto-complete></my-proucts-auto-complete>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the myProuctsAutoComplete directive');
  }));
});
