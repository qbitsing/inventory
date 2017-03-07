'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:PerfilCtrl
 * @description
 * # PerfilCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('PerfilCtrl', function ($scope, $timeout, $state, SesionUsuario, webServer) {
  	if(SesionUsuario.obtenerSesion()==null){
        $state.go('Login');
    }
    $scope.panelAnimate='';
    $scope.pageAnimate='';  
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Peril";
    $scope.button_title_form = "Actualizar datos";
  });
