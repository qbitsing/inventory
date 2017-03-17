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
    $scope.Entrada.productos=[];
    $scope.Entrada.materia_prima=[];
    $scope.CargarOrden=function(){
        $scope.Ordenes.forEach(function(ele, index){
            if(ele._id==$scope.Orden.compra){
                $scope.Entrada=ele;
            }
        });
        if(!$scope.Entrada.productos){
            $scope.Entrada.productos=[];
        }
        if(!$scope.Entrada.materia_prima){
            $scope.Entrada.materia_prima=[];
        }
    }
    $scope.EnviarEntrada=function(){
        $scope.Entrada.productos.forEach(function(ele, index){
            ele.cantidad_entrante=angular.element('#cantidad'+ele._id).val();
        });
        $scope.Entrada.materia_prima.forEach(function(ele, index){
                ele.cantidad_entrante=angular.element('#cantidad'+ele._id).val();
            });
        console.log($scope.Entrada);
    }
    function listarOrdenes(){
        webServer
        .getResource('orden_compra',{},'get')
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
