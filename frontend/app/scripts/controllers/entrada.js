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
    $scope.Detallemodal={};
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
    $scope.abrirModal=function(_id){
        $scope.Detallemodal.id=_id;
        $scope.Detallemodal.titulo='Confirmar eliminación';
        $scope.Detallemodal.mensaje='¿Esta seguro que desea eliminar la entrada?';
        $('#modalConfirmacion').modal('open');
    }
    $scope.Borrar=function(id){
        $scope.Detallemodal={};
         webServer
        .getResource('entradas/'+id,{},'delete')
        .then(function(data){
            $scope.Entradas.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.Entradas.splice(ele.index,1);
                }
            });
            $scope.Detallemodal.mensaje='La entrada se ha eliminado exitosamente';
        },function(data){
            $scope.Detallemodal.mensaje=data.data.message;
            console.log(data.data.message);
        });
        $scope.Detallemodal.titulo='Notificacion de eliminación';
        $('#modalNotificacion').modal('open');
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
            $scope.Entrada={};
            $scope.Entrada.orden_compra.productos=[];
            $scope.Entrada.orden_compra.materia_prima=[];
            $scope.Detallemodal.titulo='Notificacion de registro';
            $scope.Detallemodal.mensaje='La entrada se ha registrado exitosamente';
            listarOrdenes();
        },function(data){
            $scope.Detallemodal.titulo='Notificacion de eror';
            $scope.Detallemodal.mensaje=data.data.message;
            console.log(data.data.message);
        });
        $('#modalNotificacion').modal('open');
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
        $('#modaldeDetalles').modal('open');
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
            listarOrdenes();
        },function(data){
            $scope.Entradas=[];
            $scope.gridOptions.data=$scope.Entradas;
            console.log(data.data.message);
            listarOrdenes();
        });
    }
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
