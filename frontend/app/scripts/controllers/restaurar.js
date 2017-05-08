'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:RestaurarCtrl
 * @description
 * # RestaurarCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('RestaurarCtrl', function ($scope, webServer, $state) {
  	$scope.Enviar=function(){
  		webServer
        .getResource('personas/contrasena/',$scope.Usuario,'put')
        .then(function(data){
            $scope.Usuario={};
            sweetAlert("Completado...", "Su contraseña ha sido enviado a su correo" , "success");
            $state.go('Login');
        },function(data){
            sweetAlert("Oops...", data.data.message , "error");
        });
  	}
  });