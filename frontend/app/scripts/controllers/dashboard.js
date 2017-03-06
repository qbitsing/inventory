'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DashboardCtrl', function ($scope,$state) {
    
    $scope.sidenav = function(){
    	angular.element(".sidenav").toggleClass('sidenav-hidden');
    	angular.element(".top-nav").toggleClass('top-nav-hidden');
    	angular.element(".perfil").toggleClass('perfil-hidden');
    	angular.element(".main-view").toggleClass('main-view-full');
    }
  });
