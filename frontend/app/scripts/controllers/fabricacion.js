'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:FabricacionCtrl
 * @description
 * # FabricacionCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('FabricacionCtrl', function ($scope, $timeout, Tabla, BotonesTabla, webServer) {
	$scope.panelAnimate='';
	$scope.pageAnimate='';
	$timeout(function () {
		$scope.pageAnimate='pageAnimate';
		$scope.panelAnimate='panelAnimate';
	},100);
	$scope.panel_title_form = "Registro de fabricación";
	$scope.button_title_form = "Registrar fabricación";
  });
