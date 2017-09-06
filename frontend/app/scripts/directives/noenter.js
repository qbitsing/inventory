'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:noenter
 * @description
 * # noenter
 */
angular.module('frontendApp')
  .directive('noenter', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        $(element).keydown(function(e){
          if(e.which === 13)
            e.preventDefault()
        })
      }
    };
  });
