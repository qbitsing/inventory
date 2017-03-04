'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:topnav
 * @description
 * # topnav
 */
angular.module('frontendApp')
  .directive('topnav', function () {
    return {
		templateUrl: 'views/directives/topnav.html',
		restrict: 'E',
		link: function postLink(scope, element, attrs) {
        	element.text('this is the topnav directive');
      	},
		controller :'DashboardCtrl'
    };
  });
