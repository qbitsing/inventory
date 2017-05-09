'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:SalidaCtrl
 * @description
 * # SalidaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('SalidaCtrl', function ($scope, $timeout, Tabla, BotonesTabla, webServer, preloader) {
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
        });
    });
    $scope.preloader = preloader;
    $scope.preloader.estado = false;
    $scope.panelAnimate='';
    $scope.pageAnimate='';  
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de Salidas";
    $scope.button_title_form = "Registrar salida";
    $scope.Salida={};
    $scope.Salida.orden_venta={};
    $scope.Salida.orden_venta.productos=[];
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'orden de venta',field: 'orden_venta.orden_venta_consecutivo',
                width:'15%',
                minWidth: 100
            },
            {
                name:'no. salida',field: 'salida_consecutivo',
                width:'15%',
                minWidth: 100
            },
            {
                name:'fecha',
                width:'15%',
                cellTemplate: '<div>{{grid.appScope.convertirFecha(row.entity.fecha)}}</div>',
                minWidth: 100
            },
            {
                name:'cliente',field: 'orden_venta.cliente.nombre',
                width:'25%',
                minWidth: 150
            },
            {
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'30%',
                minWidth: 150
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
        }else{
            $scope.Salida.orden_venta.productos.forEach(function(ele,index){
                if (ele.cantidad_faltante==0) {
                    $scope.Entrada.orden_venta.productos.splice(ele.index,1);
                }
            });
        }
    }
    $scope.abrirModal=function(_id){
        swal({
            title: "Confirmar Eliminación",
            text: "¿Esta seguro de borrar la salida?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, Borrar!",
            cancelButtonText: "No, Cancelar!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm){
            if (isConfirm) {
                Borrar(_id);
            } else {
                swal("Cancelado", "La salida no se borrará", "error");
            }
        });
    }
    $scope.convertirFecha = function(fecha){
        var date = new Date(fecha).getDate();
        date += '/'+(new Date(fecha).getMonth()+1);
        date += '/'+new Date(fecha).getFullYear();
        return date;
    }
    function Borrar(id){
        $scope.preloader.estado = true;
        webServer
        .getResource('salidas/'+id,{},'delete')
        .then(function(data){
            $scope.Entradas.forEach(function(ele, ind){
                if(ele._id==id){
                    if (ele.orden_venta.productos) {
                        $scope.Ordenes.forEach(function(e,i){
                            if (e._id==ele.orden_venta._id) {
                                if (e.productos) {
                                    e.productos.forEach(function(elemento,index){
                                        ele.orden_venta.productos.forEach(function(e, i){
                                            if(e._id==elemento._id){
                                                elemento.cantidad_faltante=elemento.cantidad_faltante+e.cantidad_saliente;
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    }
                    $scope.Entradas.splice(ele.index,1);
                }
            });
            $scope.preloader.estado = false;
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message , "error");
        });
    }
    $scope.cancelarEditar=function(){
        $scope.Salida={};
        $scope.Salida.orden_venta={};
        $scope.Salida.orden_venta.productos=[];
        $scope.Orden.venta='';
    }
    $scope.EnviarSalida=function(){
        $scope.preloader.estado = true;
        if ($scope.Salida.orden_venta.productos) {
            $scope.Salida.orden_venta.productos.forEach(function(ele, index){
                ele.cantidad_saliente=angular.element('#cantidad'+ele._id).val();
                ele.cantidad_faltante=ele.cantidad_faltante-ele.cantidad_saliente;
            });
        }
        webServer
        .getResource("salidas",$scope.Salida,"post")
        .then(function(data){
            $scope.Salida.salida_consecutivo=data.data.datos.salida_consecutivo;
            $scope.Salida._id=data.data.datos._id;
            $scope.Salidas.push($scope.Salida);
            $scope.Ordenes.forEach(function(ele,ind){
                if (ele._id==$scope.Salida.orden_venta._id) {
                    if(data.data.data.datos.orden_venta.estado=='Finalizado'){
                        $scope.Ordenes.splice(ele.index,1);
                    }else{
                        ele.estado=data.data.datos.orden_venta.estado;
                        if (ele.productos && data.data.datos.orden_venta.productos) {
                            ele.productos.forEach(function(elemento,index){
                                data.data.datos.orden_venta.productos.forEach(function(e, i){
                                    if(e._id==elemento._id){
                                        elemento=e;
                                    }
                                });
                            });
                        }
                    }
                }
            });
            $scope.Salida={};
            $scope.Salida.orden_venta={};
            $scope.Salida.orden_venta.productos=[];
            $scope.Orden.venta='';
            $scope.preloader.estado = false;
            sweetAlert("Completado...", data.data.message , "success"); 
        },function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message , "error");
        });
        
    }
    function listarOrdenes(){
        webServer
        .getResource('orden_venta',{Activo: true, Salidas:true},'get')
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
    $scope.convertirFecha = function(fecha){
        var date = new Date(fecha).getDate();
        date += '/'+(new Date(fecha).getMonth()+1);
        date += '/'+new Date(fecha).getFullYear();
        return date;
    }
    function listarSalidas(){
        webServer
        .getResource('salidas',{},'get')
        .then(function(data){
            $scope.Salidas=data.data.datos;
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
  });