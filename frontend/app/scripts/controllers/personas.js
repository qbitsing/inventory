'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ClientesCtrl
 * @description
 * # ClientesCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('PersonasCtrl', function ($scope, $timeout, $state, SesionUsuario, webServer) {
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
    $scope.EnviarPersona=function(){
        var ruta="";
        var metodo="";
        if ($scope.panel_title_form=="Registro de Personas") {
            ruta="personas";
            metodo="post";
        }else{
            ruta="personas/"+$scope.Persona.documento;
            metodo="put";
        }
        webServer.getResource(ruta,$scope.Persona,metodo).then(function(data){
           console.log(data);
        },function(data){
          alert(data.data.message);
        });
    }
});
