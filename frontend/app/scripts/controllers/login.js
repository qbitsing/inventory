'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('LoginCtrl', function ($scope, webServer, SesionUsuario,$state) {
    if(SesionUsuario.obtenerSesion()!=null){
      $state.go('Home');
    }
  	$scope.userLogin={};
  	$scope.login=function(){
  		webServer.getResource('personas/login',$scope.userLogin,'post')
  		.then(function(data){
  			if(SesionUsuario.CrearSesion(data.data.datos)){
          $state.go('Home');
  			}
  		},function(data){
          alert(data.data.message);
  		});
  	}
  });
