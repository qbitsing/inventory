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
    $scope.panel_title_form = "Registro de Salidas";
    $scope.button_title_form = "Registrar salida";
    $scope.Salida={};
    $scope.Salida.orden_venta=[];
    $scope.Salida.orden_venta.productos=[];
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'numero de orden de venta',field: 'consecutivo',
                width:'20%',
                minWidth: 160
            },
            {
                name:'numero de remision',field: 'remision',
                width:'20%',
                minWidth: 160
            },
            {
                name:'cliente',field: 'cliente.nombre',
                width:'30%',
                minWidth: 200
            },
            {
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'30%',
                minWidth: 230
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);
    $scope.CargarOrden=function(){
        $scope.Ordenes.forEach(function(ele, index){
            if(ele._id==$scope.Orden.venta){
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
        webServer
        .getResource("salida",$scope.Salida,"post")
        .then(function(data){
            $scope.Salidas.push($scope.Salida);
            alert('Salida registrada correctamente');
            $scope.Salida={};
            $scope.Salida.orden_venta.productos=[];
            $scope.Salida.orden_venta.materia_prima=[];
        },function(data){
            console.log(data);
        });
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
    function listarSalidas(){
        webServer
        .getResource('salida',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Salidas=data.data.datos;
            }else{
                $scope.Salidas=[];
            }
            $scope.gridOptions.data=$scope.Salidas;
        },function(data){
            $scope.Salidas=[];
            $scope.gridOptions.data=$scope.Salidas;
            console.log(data.data.message);
        });
    }
    listarOrdenes();
    listarSalidas();
    function IdentificarSalida(id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    index: index,
                    _id : ele._id,
                    orden_venta : ele.orden_venta,
                    observaciones : ele.observaciones
                };
            }
        });
        return obj;
    }
  });
