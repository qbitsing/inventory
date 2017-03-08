'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:sidenav
 * @description
 * # sidenav
 */
angular.module('frontendApp')
  .directive('sidenavb', function () {
    return {
		templateUrl: 'views/directives/sidenav.html',
		restrict: 'E',
		link: function postLink(scope, element, attrs) {
      	},
		controller :'DashboardCtrl'
    };
  });