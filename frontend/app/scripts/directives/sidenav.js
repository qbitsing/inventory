'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:sidenav
 * @description
 * # sidenav
 */
angular.module('frontendApp')
  .directive('sidenav', function () {
    return {
		templateUrl: 'views/directives/sidenav.html',
		restrict: 'E',
		link: function postLink(scope, element, attrs) {
        	element.text('this is the sidenav directive');
      	},
		controller :'DashboardCtrl'
    };
  });