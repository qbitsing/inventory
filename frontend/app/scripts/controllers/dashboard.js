'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DashboardCtrl', function ($scope,$state,SesionUsuario) {
    $scope.$state=$state;
    $scope.Usuario=SesionUsuario.obtenerSesion();
    $scope.NombreDeUsuario='';
    var i=0;
    var contador=0;
    while (i==0) {
        var caracter = $scope.Usuario.nombre.charAt(contador);
        if(caracter==" " || contador==$scope.Usuario.nombre.lenght){
            i=1;
        }else{
            $scope.NombreDeUsuario+=caracter;
        }
        contador++;
    }
    $scope.NombreDeUsuario+=' ';
    i=0;
    contador=0;
    while (i==0) {
        var caracter = $scope.Usuario.apellidos.charAt(contador);
        if(caracter==" " || contador==$scope.Usuario.apellidos.lenght){
            i=1;
        }else{
            $scope.NombreDeUsuario+=caracter;
        }
        contador++;
    }
    $scope.sidenav = function(){
        angular.element(".sidenav").toggleClass('sidenav-hidden');
        angular.element(".top-nav").toggleClass('top-nav-hidden');
        angular.element(".perfil").toggleClass('perfil-hidden');
        angular.element(".main-view").toggleClass('main-view-full');
        angular.element(".side-nav>ul>li").click(function(event) {
            if (screen.width<=600) {
                angular.element(".sidenav").addClass('sidenav-hidden');
                angular.element(".top-nav").addClass('top-nav-hidden');
                angular.element(".perfil").addClass('perfil-hidden');
                angular.element(".main-view").addClass('main-view-full');
            }
            
        });
    }
    $scope.active=true;
    $scope.cerrarSesion=function(){
        SesionUsuario.CerrarSesion();
    	$state.go('Login');
    }
  });
