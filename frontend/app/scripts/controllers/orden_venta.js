'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:OrdenVentaCtrl
 * @description
 * # OrdenVentaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('OrdenVentaCtrl', function ($scope, $timeout) {
    $scope.panelAnimate='';
    $scope.pageAnimate='';  
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de venta";
    $scope.button_title_form = "Registrar venta";
  });
