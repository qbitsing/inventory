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
  	$scope.userLogin={};
  	$scope.login=function(){
  		webServer.getResource('personas/login',$scope.userLogin,'post')
  		.then(function(data){
  			if (data.data.Estado==1) {
	  			if(SesionUsuario.CrearSesion(data.data.datos)){
	  				console.log(data.data);
            $state.go('Home');
	  			}
  			}
  		},function(data){
  			console.log(data);
  		});
  	}
  });
