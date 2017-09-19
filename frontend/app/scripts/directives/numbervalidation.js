'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:numbervalidation
 * @description
 * # numbervalidation
 */
angular.module('frontendApp')
  .directive('numbervalidation', function () {
    return{
      link: function (_, element) {
        $(element).on('focus', function (e) {
          $(this).on('mousewheel.disableScroll', function (e) {
            e.preventDefault();
          });
        });
        $(element).on('keypress', function (evt){
          var charCode = (evt.which) ? evt.which : event.keyCode
             if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
             return true;
        });
      }
    }
  });
