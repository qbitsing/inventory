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
    $scope.panel_title_form = "Registro de Salidas";
    $scope.button_title_form = "Registrar salida";
    $scope.Salida={};
    $scope.Detallemodal={};
    $scope.Salida.orden_venta={};
    $scope.Salida.orden_venta.productos=[];
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'orden de venta',field: 'orden_venta.consecutivo',
                width:'20%',
                minWidth: 160
            },
            {
                name:'cliente',field: 'orden_venta.cliente.nombre',
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
        console.log($scope.Salida.orden_venta);
    }
    $scope.abrirModal=function(_id){
        $scope.Detallemodal.id=_id;
        $scope.Detallemodal.titulo='Confirmar eliminación';
        $scope.Detallemodal.mensaje='¿Esta seguro que desea eliminar esta salida?';
        $('#modalConfirmacion').modal('open');
    }
    $scope.Borrar=function(id){
        $('#modalConfirmacion').modal('close');
        $scope.Detallemodal={};
         webServer
        .getResource('salidas/'+id,{},'delete')
        .then(function(data){
            $scope.Entradas.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.Entradas.splice(ele.index,1);
                }
            });
            $scope.Detallemodal.titulo='Notificacion de eliminación';
            $scope.Detallemodal.mensaje=data.data.message;
            $('#modalNotificacion').modal('open');
        },function(data){
            $scope.Detallemodal.titulo='Notificacion de eliminación';
            $scope.Detallemodal.mensaje=data.data.message;
            $('#modalNotificacion').modal('open');
            console.log(data.data.message);
        });
    }
    $scope.EnviarSalida=function(){
        if ($scope.Salida.orden_venta.productos) {
            $scope.Salida.orden_venta.productos.forEach(function(ele, index){
                ele.cantidad_saliente=angular.element('#cantidad'+ele._id).val();
                ele.cantidad_faltante=ele.cantidad_faltante-ele.cantidad_saliente;
            });
        }
        webServer
        .getResource("salidas",$scope.Salida,"post")
        .then(function(data){
            $scope.Salida._id=data.data._id;
            $scope.Salidas.push($scope.Salida);
            $scope.Ordenes.forEach(function(ele,ind){
                if (ele._id==$scope.Salida.orden_venta._id) {
                    if (ele.productos) {
                        ele.productos.forEach(function(elemento,index){
                            $scope.Salida.orden_venta.productos.forEach(function(e, i){
                                if(e._id==elemento._id){
                                    elemento=e;
                                }
                            });
                        });
                    }
                }
            });
            $scope.Salida={};
            $scope.Salida.orden_venta={};
            $scope.Salida.orden_venta.productos=[];
            $scope.Detallemodal.titulo='Notificacion de registro';
            $scope.Detallemodal.mensaje=data.data.message;
            $('#modalNotificacion').modal('open'); 
        },function(data){
            $scope.Detallemodal.titulo='Notificacion de eror';
            $scope.Detallemodal.mensaje=data.data.message;
            $('#modalNotificacion').modal('open');
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
    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Salidas.find(function(ele){
            if(ele._id == id){
                return ele;
            }
        });
        if(!$scope.Detalle.orden_venta.productos){
            $scope.Detalle.orden_venta.productos=[];
        }
        $('#modaldeDetalles').modal('open');
    }
    function listarSalidas(){
        webServer
        .getResource('salidas',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Salidas=data.data.datos;
            }else{
                $scope.Salidas=[];
            }
            $scope.gridOptions.data=$scope.Salidas;
            listarOrdenes();
        },function(data){
            $scope.Salidas=[];
            $scope.gridOptions.data=$scope.Salidas;
            console.log(data.data.message);
            listarOrdenes();
        });
    }
    listarSalidas();
    function IdentificarSalida(id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    index: index,
                    _id : ele._id,
                    orden_venta : ele.orden_venta,
                    observaciones : ele.observaciones,
                    remision : remision
                };
            }
        });
        return obj;
    }
  });
