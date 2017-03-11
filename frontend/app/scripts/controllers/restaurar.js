'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:RestaurarCtrl
 * @description
 * # RestaurarCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('RestaurarCtrl', function ($scope, webServer) {
  	$scope.Enviar=function(){
  		webServer
        .getResource('personas/contrasena/',$scope.Usuario,'put')
        .then(function(data){
            alert('Su contraseña es:'+data.data.pass);
        },function(data){
            console.log(data);
        });
  	}
  });