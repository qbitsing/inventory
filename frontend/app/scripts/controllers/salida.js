'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:SalidaCtrl
 * @description
 * # SalidaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('SalidaCtrl', function ($scope, $timeout, Tabla, BotonesTabla, webServer) {
    $scope.panelAnimate='';
    $scope.pageAnimate='';  
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de salida";
    $scope.button_title_form = "Registrar salida";
    $scope.Salida={};
    $scope.Salida.orden_venta=[];
    $scope.Salida.orden_venta.productos=[];
    $scope.CargarOrden=function(){
        $scope.Ordenes.forEach(function(ele, index){
            if(ele._id==$scope.Orden.compra){
                $scope.Salida.orden_venta=ele;
            }
        });
        if(!$scope.Salida.orden_venta.productos){
            $scope.Salida.orden_venta.productos=[];
        }
    }
    $scope.EnviarSalida=function(){
        $scope.Salida.orden_venta.productos.forEach(function(ele, index){
            ele.cantidad_saliente=angular.element('#cantidad'+ele._id).val();
        });
        $scope.Salida.orden_venta.materia_prima.forEach(function(ele, index){
                ele.cantidad_saliente=angular.element('#cantidad'+ele._id).val();
            });
        console.log($scope.Salida);
    }
    function listarOrdenes(){
        webServer
        .getResource('orden_venta',{},'get')
        .then(function(data){
            if(data.data){
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
