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
    $scope.Salida.productos=[];
    $scope.CargarOrden=function(){
        $scope.Ordenes.forEach(function(ele, index){
            if(ele._id==$scope.Orden.compra){
                $scope.Salida=ele;
            }
        });
        if(!$scope.Salida.productos){
            $scope.Salida.productos=[];
        }
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
    function listarEmpleados(){
        webServer
        .getResource('personas',{empleado:true,administrador:true,almacenista:true,super_administrador:true},'get')
        .then(function(data){
            if(data.data){
                $scope.empleados = data.data.datos;
            }else{
                $scope.empleados = [];
            }
        },function(data){
            console.log(data);
        });
    }
    listarOrdenes();
    listarEmpleados();
  });
