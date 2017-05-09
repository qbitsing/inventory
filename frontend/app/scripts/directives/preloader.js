'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:preloader
 * @description
 * # preloader
 */
angular.module('frontendApp')
  .directive('preloader', function (preloader) {
    return {
      templateUrl: 'views/directives/preloader.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      },
      controller :'DashboardCtrl',
    };
  });
