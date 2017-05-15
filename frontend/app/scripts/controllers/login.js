'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('LoginCtrl', function ($scope, webServer, SesionUsuario, $state, preloader) {
    $scope.preloader = preloader;
    $scope.preloader.estado = false;
    if(SesionUsuario.ObtenerSesion()!=null){
        $state.go('Home');
    }
  	$scope.userLogin={};
  	$scope.login=function(){
      $scope.preloader.estado = true;
  		webServer.getResource('personas/login',$scope.userLogin,'post')
  		.then(function(data){
            $scope.preloader.estado = false;
            if(SesionUsuario.CrearSesion(data.data.datos)){
                $state.go('Home');
            }
  		},function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message, "error");
  		});
  	}
})