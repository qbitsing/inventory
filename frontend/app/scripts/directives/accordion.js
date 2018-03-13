'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:accordion
 * @description
 * # accordion
 */
angular.module('frontendApp')
  .directive('accordion', function () {
    return {
      link: function (_, element) {
        $(element).on('click', function (e) {
          $(this).toggleClass("rotate-accordion");
        })
      }
    };
  });
