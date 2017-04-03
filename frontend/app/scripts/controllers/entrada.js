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
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'orden de compra',field: 'orden_compra.consecutivo',
                width:'20%',
                minWidth: 200
            },
            {
                name:'Factura',field: 'numero_factura',
                width:'20%',
                minWidth: 250
            },
            {
                name:'proveedor',field: 'orden_compra.proveedor.nombre',
                width:'30%',
                minWidth: 250
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
        webServer
        .getResource('entradas',$scope.Entrada,'post')
        .then(function(data){
            $scope.Entradas.push($scope.Entrada);
            alert('Entrada registrada correctamente');
            $scope.Entrada={};
            $scope.Entrada.orden_compra.productos=[];
            $scope.Entrada.orden_compra.materia_prima=[];
            listarOrdenes();
        },function(data){
            console.log(data);
        });
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
    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Entradas.find(function(ele){
            if(ele._id == id){
                return ele;
            }
        });
        if(!$scope.Detalle.orden_compra.materia_prima){
            $scope.Detalle.orden_compra.materia_prima=[];
        }
        if(!$scope.Detalle.orden_compra.productos){
            $scope.Detalle.orden_compra.productos=[];
        }
        console.log($scope.Detalle);
        $('#modaldeDetalles').modal('open');
    }
    $scope.Borrar = function(id){
        webServer
        .getResource('entradas/'+id,{},'delete')
        .then(function(data){
            $scope.Entradas.find(function(ele){
                if(ele._id == id){
                    $scope.Entradas.splice(ele.index,1);
                }
            });
        },function(data){
            alert('Ocurrio un error al eliminar la salida');
            console.log(data.data.message);
        });
    }
    function listarEntradas(){
        webServer
        .getResource('Entradas',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Entradas=data.data.datos;
            }else{
                $scope.Entradas=[];
            }
            $scope.gridOptions.data=$scope.Entradas;
        },function(data){
            $scope.Entradas=[];
            $scope.gridOptions.data=$scope.Entradas;
            console.log(data.data.message);
        });
    }
    listarOrdenes();
    listarEntradas();
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
