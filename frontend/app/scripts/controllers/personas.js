'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ClientesCtrl
 * @description
 * # ClientesCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('PersonasCtrl', function ($scope, $timeout, $state, SesionUsuario) {
  	if(SesionUsuario.obtenerSesion()==null){
      $state.go('Login');
    }
    $scope.panelAnimate='';
    $scope.pageAnimate='';  
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de Personas";
    $scope.button_title_form = "Registrar Persona";
    $scope.Persona=[];
    $scope.Persona.rol={};
  });
