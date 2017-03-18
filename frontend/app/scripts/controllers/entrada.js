'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EntradaCtrl
 * @description
 * # EntradaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('EntradaCtrl', function ($scope, $timeout, Tabla, BotonesTabla, webServer) {
  	$scope.panelAnimate='';
    $scope.pageAnimate='';  
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de Entrada";
    $scope.button_title_form = "Registrar Entrada";
    $scope.Entrada={};
    $scope.Entrada.orden_compra=[];
    $scope.Entrada.orden_compra.productos=[];
    $scope.Entrada.orden_compra.materia_prima=[];
    $scope.CargarOrden=function(){
        $scope.Ordenes.forEach(function(ele, index){
            if(ele._id==$scope.Orden.compra){
                $scope.Entrada.orden_compra=ele;
            }
        });
        if(!$scope.Entrada.orden_compra.productos){
            $scope.Entrada.orden_compra.productos=[];
        }
        if(!$scope.Entrada.orden_compra.materia_prima){
            $scope.Entrada.orden_compra.materia_prima=[];
        }
    }
    $scope.EnviarEntrada=function(){
        $scope.Entrada.orden_compra.productos.forEach(function(ele, index){
            ele.cantidad_entrante=angular.element('#cantidad'+ele._id).val();
        });
        $scope.Entrada.orden_compra.materia_prima.forEach(function(ele, index){
                ele.cantidad_entrante=angular.element('#cantidad'+ele._id).val();
            });
        console.log($scope.Entrada);
    }
    function listarOrdenes(){
        webServer
        .getResource('orden_compra',{},'get')
        .then(function(data){
            if(data.data){
                console.log(data.data.datos);
                $scope.Ordenes=data.data.datos;
            }else{
                $scope.Ordenes=[];
            }
        },function(data){
            $scope.Ordenes=[];
            $scope.gridOptions.data=$scope.Ordenes;
            console.log(data.data.message);
        });
    }
    listarOrdenes();
  });
