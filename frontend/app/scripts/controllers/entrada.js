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
    $scope.panel_title_form = "Registro de Entradas";
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
        var ruta="";
        var metodo="";
        if ($scope.panel_title_form=="Registro de Entradas") {
            ruta="entrada";
            metodo="post";
        }else{
            ruta="entrada/"+$scope.Entrada._id;
            metodo="put";
        }
        webServer
        .getResource(ruta,$scope.Entrada,metodo)
        .then(function(data){
            if($scope.panel_title_form=="Registro de Entradas"){
                $scope.Entradas.push($scope.Entrada);
                alert('Entrada registrada correctamente');
            }else{
                $scope.Ordenes[$scope.Orden.index] = $scope.Orden;
                alert('Entrada actualizada correctamente');
            }
            $scope.Entrada={};
            $scope.Entrada.orden_compra.productos=[];
            $scope.Entrada.orden_compra.materia_prima=[];
        },function(data){
            console.log(data);
        });
        console.log($scope.Entrada);
    }
    $scope.Editar = function(id){
        $scope.panel_title_form = "Edicion de Entradas";
        $scope.button_title_form = "Editar Entrada";
        $scope.Entrada=IdentificarEntrada(id,$scope.Entradas);
        $scope.Orden.compra=$scope.Entrada.orden_compra._id;
        if(!$scope.Entrada.orden_compra.productos){
            $scope.Entrada.orden_compra.productos=[];
        }
        if(!$scope.Entrada.orden_compra.materia_prima){
            $scope.Entrada.orden_compra.materia_prima=[];
        }
    }
    $scope.CancelarEditar=function(){
        $scope.Entrada={};
        $scope.Entrada.orden_compra.productos=[];
        $scope.Entrada.orden_compra.materia_prima=[];
        $scope.panel_title_form = "Registro de Entradas";
        $scope.button_title_form = "Registrar Entrada";
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
    listarOrdenes();
    function IdentificarEntrada(id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    index: index,
                    _id : ele._id,
                    orden_compra : ele.orden_compra,
                    observaciones : ele.observaciones
                };
            }
        });
        return obj;
    }
  });
