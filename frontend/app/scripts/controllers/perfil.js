'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:PerfilCtrl
 * @description
 * # PerfilCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('PerfilCtrl', function ($scope, $timeout, SesionUsuario, webServer) {
    $(document).ready(function(){
        $('.modal').modal();
        $('.modal').modal({
                dismissible: true, // Modal can be dismissed by clicking outside of the modal
                opacity: 0, // Opacity of modal background
                inDuration: 300, // Transition in duration
                outDuration: 200, // Transition out duration
                startingTop: '10%', // Starting top style attribute
                endingTop: '15%', // Ending top style attribute
                ready: function(modal, trigger) {
                },
                complete: function() {  } // Callback for Modal close
            }
        );
    });
    $scope.panelAnimate='';
    $scope.pageAnimate='';  
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Perfil";
    $scope.button_title_form = "Actualizar datos";
    $scope.Usuario=SesionUsuario.ObtenerSesion();
    $scope.MiUsuario={};
    $scope.cambio=false;
    $scope.myCroppedImage='';
    var handleFileSelect=function(evt) {
        angular.element(document.querySelector('#inputval')).text( $(this).val());
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
          $scope.$apply(function($scope){
            $scope.contador=4;
            $scope.myImage=evt.target.result;
          });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    $scope.cambiar=function(act){
        if(act==1 && $scope.contador<3){
            $scope.contador=1;
        }else if(act==2){
            $scope.contador++;
        }
        if($scope.contador>=3){
            $scope.cambio=true;
        }
    }
    $scope.CambiarPss=function(){
        webServer
        .getResource('personas/'+$scope.Usuario._id , $scope.Pss , 'put')
        .then(function(data){
            $('#modalPss').modal('close');
        },function(data){
            console.log(data);
        });
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
        if(JSON.stringify($scope.Usuario)!=JSON.stringify(SesionUsuario.ObtenerSesion())){
            webServer
            .getResource('personas/'+$scope.Usuario._id , $scope.Usuario , 'put')
            .then(function(data){
                SesionUsuario.ActualizarSesion($scope.Usuario);
                alert('Operación realizada con exito');
            },function(data){
            });
        }else{
            if(actualizo==1){
                alert('Operación realizada con exito');
            }else{
                alert('No hay ningun dato por actualizar');
            }
        }
    }
  });
