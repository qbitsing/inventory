'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:SalidaCtrl
 * @description
 * # SalidaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('SalidaCtrl', function ($state, $scope, server, $timeout, Tabla, BotonesTabla, webServer, preloader) {
    $(document).ready(function () {
        $('.modal').modal();
        $('.modal').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: 0, // Opacity of modal background
            inDuration: 300, // Transition in duration
            outDuration: 200, // Transition out duration
            startingTop: '10%', // Starting top style attribute
            endingTop: '15%', // Ending top style attribute
            ready: function (modal, trigger) {
            },
            complete: function() {  } // Callback for Modal close
        });
    });
    $scope.fecha = Date.now();
    $scope.preloader = preloader;
    $scope.preloader.estado = false;
    $scope.panelAnimate='';
    $scope.pageAnimate='';
    $scope.server = server;
    if ($scope.Usuario.rol=='Contador') {
        $state.go('Home');
    }
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de Salidas";
    $scope.button_title_form = "Registrar salida";
    $scope.Salida={};
    $scope.Salida.orden_venta={};
    $scope.Salida.orden_venta.productos=[];
    $scope.noDisponible=[];
    $scope.Orden='';
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles;
    casillaDeBotones+= BotonesTabla.ImprimirRemision;
    casillaDeBotones+= BotonesTabla.ImprimirOrdenSalida;
    if ($scope.Usuario.rol=='Super Administrador') {
        casillaDeBotones+=BotonesTabla.Borrar;
    }
    casillaDeBotones+='</div>';
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
                width:'15%',
                minWidth: 130
            },
            {
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'40%',
                minWidth: 450
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);
    $scope.CargarOrden=function(){
        $scope.Ordenes.forEach(function(ele, index){
            if(ele._id==$scope.Orden){
                $scope.Salida.orden_venta=ele;
            }
        });
        if(!$scope.Salida.orden_venta.productos){
            $scope.Salida.orden_venta.productos=[];
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
            showLoaderOnConfirm: true,
        },
        function(){
            Borrar(_id);
        });
    }
    $scope.convertirFecha = function(fecha){
        var date = new Date(fecha).getDate();
        date += '/'+(new Date(fecha).getMonth()+1);
        date += '/'+new Date(fecha).getFullYear();
        return date;
    }
    function Borrar(id){
        webServer
        .getResource('salidas/'+id,{},'delete')
        .then(function(data){
            $scope.Ordenes.forEach(function(ele,ind){
                if (ele._id==data.data.datos.orden_venta._id) {
                    $scope.Ordenes[ind] = data.data.datos.orden_venta;
                }
            });
            $scope.Salidas.forEach(function(ele, ind){
                if(ele._id==id){
                    $scope.Salidas.splice(ind,1);
                }
            });
            swal("Completado...", data.data.message , "success");
        },function(data){
            swal("Oops...", data.data.message , "error");
        });
    }
    $scope.cancelarEditar=function(){
        $scope.Salida={};
        $scope.Salida.orden_venta={};
        $scope.Salida.orden_venta.productos=[];
        $scope.Orden='';
    }
    $scope.EnviarSalida=function(){
        $scope.Salida.generado=$scope.Usuario;
        delete $scope.Salida.generado.Image;
        var contadorcantidades=false;
        var contadorproductos=false;
        var conter=false;
        if ($scope.Salida.orden_venta.productos) {
            conter=true;            
            $scope.Salida.orden_venta.productos.forEach(function(ele, index){
                if (ele.cantidad_faltante>0) {
                    contadorproductos=true;
                    ele.cantidad_saliente=parseInt(angular.element('#cantidad'+ele._id).val());
                    if (ele.cantidad_faltante<ele.cantidad_saliente) {
                        conter=false;
                    }
                    if (parseInt(angular.element('#cantidad'+ele._id).val())>0) {
                        contadorcantidades=true;
                    }
                }else{
                    ele.cantidad_saliente=0;
                }
            });
        }
        if (contadorproductos) {
            if (conter) {
                if (contadorcantidades) {
                    $scope.preloader.estado = true;
                    $scope.Salida.fecha=new Date(Date.now());
                    webServer
                    .getResource("salidas",$scope.Salida,"post")
                    .then(function(data){
                        $scope.Salida.salida_consecutivo=data.data.datos.salida_consecutivo;
                        $scope.Salida._id=data.data.datos._id;
                        $scope.Salidas.unshift($scope.Salida);
                        $scope.Ordenes.forEach(function(ele,ind){
                            if (ele._id==$scope.Salida.orden_venta._id) {
                                $scope.Ordenes[ind] = data.data.datos.orden_venta;
                            }
                        });
                        $scope.Salida={};
                        $scope.Salida.orden_venta={};
                        $scope.Salida.orden_venta.productos=[];
                        $scope.Orden='';
                        $scope.preloader.estado = false;
                        sweetAlert("Completado...", data.data.message , "success");
                    },function(data){
                        $scope.preloader.estado = false;
                        if (data.data.noDisponibles.length>0) {
                            $scope.noDisponible=data.data.noDisponibles;
                            var mensaje='<ul>';
                            $scope.noDisponible.forEach(function(ele,index){
                                mensaje+='<li>'+ele+'</li>'
                            });
                            mensaje+='</ul>';
                            swal({
                                title: "No se puede realizar la salida",
                                text: mensaje,
                                type: "error",
                                html: true
                            });
                            $scope.Salida.orden_venta.productos.forEach(function(ele, index){
                                ele.cantidad_faltante=parseInt(ele.cantidad_faltante)+parseInt(ele.cantidad_saliente);
                            });
                            $scope.Salida={};
                            $scope.Salida.orden_venta={};
                            $scope.Salida.orden_venta.productos=[];
                            $scope.Orden='';
                        }else{
                            sweetAlert("Oops...", data.data.message , "error");
                        }
                    });
                }else{
                    sweetAlert("Oops...", "Ingrese cantidades validas para efectuar la salida" , "error");
                }
            }else{
                sweetAlert("Oops...", "Esta intentando sacar cantidades mayores a las faltantes" , "error");
            }
        }else{
            sweetAlert("Oops...", "No hay productos que sacar" , "error");
        }
    }

    $scope.Imprimir = function(formato , tipo){
        formato.orden_venta.productos = formato.orden_venta.productos.filter(function (a) {
          return a.cantidad_saliente > 0
        });
        $scope.formato = formato;
        var formatoPrint = null;
        if(tipo == 1){
            formatoPrint = document.getElementById('container');
        }

        if(tipo == 2){
            formatoPrint = document.getElementById('container2');
        }

        var w = window.open();
        var d = w.document.open();
        d.appendChild(formatoPrint);

        webServer
        .getResource('orden_venta',{Activo: true, Salidas:true, Finalizado:true},'get')
        .then(function(data){
            w.print();
            w.close();
            document.getElementById('superContainer').appendChild(formatoPrint);
        },function(data){
            w.print();
            w.close();
            document.getElementById('superContainer').appendChild(formatoPrint);
        });
    }
    function listarOrdenes(){
        webServer
        .getResource('orden_venta',{Activo: true, Salidas:true, Finalizado:true},'get')
        .then(function(data){
            $scope.Ordenes=data.data.datos;
            $scope.preloader.estado = false;
        },function(data){
            $scope.Ordenes=[];
            $scope.gridOptions.data=$scope.Ordenes;
            $scope.preloader.estado = false;
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
        $scope.preloader.estado = true;
        webServer
        .getResource('salidas',{},'get')
        .then(function(data){
            $scope.Salidas=data.data.datos;
            $scope.gridOptions.data=$scope.Salidas;
            var height
            if ($scope.gridOptions.data.length >= 25 ){
                height = (30 * 25) + 140
            }
            else {
                height = (30 * $scope.gridOptions.data.length) + 140
            }
            $('.grid').height(height)
            listarOrdenes();
        },function(data){
            $scope.Salidas=[];
            $scope.gridOptions.data=$scope.Salidas;
            listarOrdenes();
        });
    }
    listarSalidas();
  })
