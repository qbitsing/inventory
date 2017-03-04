'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EmpleadosCtrl
 * @description
 * # EmpleadosCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('EmpleadosCtrl', function ($scope, $timeout, $state, SesionUsuario) {
	if(SesionUsuario.obtenerSesion()==null){
    $state.go('Login');
  }
  $scope.panelAnimate='';
  $scope.pageAnimate='';  
  $timeout(function () {
      $scope.pageAnimate='pageAnimate';
      $scope.panelAnimate='panelAnimate';
  },100);
  $scope.panel_title_form = "Registro de Empleados";
$scope.button_title_form = "Registrar Empleado";
});
