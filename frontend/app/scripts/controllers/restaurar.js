'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:RestaurarCtrl
 * @description
 * # RestaurarCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('RestaurarCtrl', function ($scope, webServer, $state, preloader) {
    $scope.preloader = preloader;
    $scope.preloader.estado = false;
  	$scope.Enviar=function(){
      $scope.preloader.estado = true;
  		webServer
        .getResource('personas/contrasena/',$scope.Usuario,'put')
        .then(function(data){
            $scope.Usuario={};
            $scope.preloader.estado = false;
            sweetAlert("Completado...", "Su contraseña ha sido enviado a su correo" , "success");
            $state.go('InicioSesion');
        },function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message , "error");
        });
  	}
  })