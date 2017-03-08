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
    $scope.panel_title_form = "Perfil";
    $scope.button_title_form = "Actualizar datos";
    $scope.Usuario=SesionUsuario.obtenerSesion();
    $scope.MiUsuario={};
    $scope.cambio=false;
    $scope.myCroppedImage='';
    var handleFileSelect=function(evt) {
        angular.element(document.querySelector('#inputval')).text( $(this).val());
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
          $scope.$apply(function($scope){
            $scope.myImage=evt.target.result;
            $scope.contador=4;
          });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    $scope.cambiar=function(act){
        if(act==1){
            $scope.contador=1;
        }else if(act==2){
            $scope.contador++;
        }
        if($scope.contador>=3){
            $scope.cambio=true;
        }
    }
    $scope.ImageUpdate=function(){
        if($scope.cambio){
            $scope.MiUsuario.myImage=$scope.myCroppedImage;
            $scope.MiUsuario.Image=$scope.myImage;
            webServer
            .getResource('personas/'+$scope.Usuario._id , $scope.MiUsuario , 'put')
            .then(function(data){
                EnviarDatos(1);
            },function(data){
            });
        }else{
            EnviarDatos(0);
        }
    }
    function EnviarDatos(actualizo){
        if(JSON.stringify($scope.Usuario)!=JSON.stringify(SesionUsuario.obtenerSesion())){
            webServer
            .getResource('personas/'+$scope.Usuario._id , $scope.Usuario , 'put')
            .then(function(data){
                console.log(data);
            },function(data){
            });
        }else{
            
        }
    }
  });
