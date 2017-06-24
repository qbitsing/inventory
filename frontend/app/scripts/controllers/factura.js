'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:FacturaCtrl
 * @description
 * # FacturaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('FacturaCtrl', function ($scope, $state, preloader,BotonesTabla, server, webServer, numeroaletras, $timeout, Tabla) {
    $scope.panelAnimate='';
	$scope.pageAnimate='';
    $(document).ready(function(){
        $('.modal').modal();
        $('.modal').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: 0, // Opacity of modal background
            inDuration: 300, // Transition in duration
            outDuration: 200, // Transition out duration
            startingTop: '10%', // Starting top style attribute
            endingTop: '15%', // Ending top style attribute,
            ready: function(modal, trigger) {
            },
            complete: function() {  } // Callback for Modal close
        });
    });
	$timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.newFactura = true;
    $scope.server = server;
    $scope.fecha = fechaHoy();
    $scope.iva = 19;
    $scope.valorIva = 0;
    $scope.subtotal = 0;
    $scope.total = 0;
    $scope.Facturas = [];
    $scope.Detalle = {};
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Borrar+BotonesTabla.Imprimir+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'no. orden',field: 'consecutivo',
                width:'10%',
                minWidth: 100
            },
            {
                name:'fecha',
                width:'15%',
                cellTemplate: '<div>{{grid.appScope.convertirFecha(row.entity.fecha)}}</div>',
                minWidth: 100
            },
            {
                field:  'subtotal',
                width:'15%',
                minWidth: 100
            },
            { 
                name: 'Iva',
                field: 'valorIva',
                width:'15%',
                minWidth: 100
            },
            { 
                field: 'total',
                width:'15%',
                minWidth: 100
            },
            {
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'30%',
                minWidth: 230
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);
    $scope.print = function(){
        preloader.estado = true;
        var factura = {
            productos: $scope.Orden.productos,
            cliente: $scope.Orden.cliente,
            iva: $scope.iva,
            valorIva: $scope.valorIva,
            subtotal: $scope.subtotal,
            total: $scope.total,
            fecha: Date.now(),
            vencimiento: $scope.vencimiento,
            remision: $scope.remision,
            ordenCompra: $scope.ordenCompra,
            orden: $scope.Orden._id,
            consecutivo: $scope.Orden.orden_venta_consecutivo
        };
        if(!$scope.remision){
            $('#remision').html('');
        }
        if(!$scope.ordenCompra){
            $('#ordenCompra').html('');
        }
        var w = window.open();
        var d = w.document.open();
        var eleToPrint = $('#container')[0];
        d.append(eleToPrint);
        webServer.getResource('facturas', factura, "post")
        .then(function (data) {
            preloader.estado = false;
            sweetAlert('Completado...', data.data.message, 'success');
            w.print();
            w.close();
            $state.go('OrdenVenta');
        }, function (data) {
            preloader.estado = false;
            sweetAlert('Oops...', data.data.message, 'error');
            w.close();
            $state.go('OrdenVenta');
            
        });
               
    }
    webServer.getResource('orden_venta/'+$state.params._id, {} , 'get')
    .then(function(data){
        $scope.Orden = data.data.datos;
        $scope.calcularTotal();
    }, function(data){
        $scope.newFactura = false;
        $scope.listarFacturas();
        
    });

    $scope.listarFacturas = function(){
        webServer.getResource('facturas', {} , 'get')
        .then(function(data){
            $scope.Facturas = data.data.datos;
            $scope.gridOptions.data = $scope.Facturas;
        }, function(data){
            $scope.gridOptions.data = $scope.Facturas;
            $state.go('OrdenVenta');
        });
    }
    $scope.calcularTotal= function(){
        $scope.subtotal = 0;
        $scope.Orden.productos.forEach(function(pro){
            $scope.subtotal += pro.cantidad * pro.precio;
        });
        $scope.calcularIva();
    }
    $scope.calcularIva = function (){
        $scope.valorIva = $scope.subtotal * ($scope.iva / 100);
        $scope.total = $scope.subtotal + $scope.valorIva;
    }
    function fechaHoy(){
        var date = new Date().getDate();
        date += ' / '+(new Date().getMonth()+1);
        date += ' / '+new Date().getFullYear();
        return date;
    }
    $scope.covert = function (argument) {
        return numeroaletras.doit(argument);
    }

    $scope.convertirFecha = function(fecha){
        var date = new Date(fecha).getDate();
        date += '/'+(new Date(fecha).getMonth()+1);
        date += '/'+new Date(fecha).getFullYear();
        return date;
    }

    $scope.Detalles = function(id){
        $scope.Detalle = identificar(id, $scope.Facturas);

        if($scope.Detalle != null){
            $('#modalFacturas').modal('open');
        }
    }

    $scope.abrirModal = function(id){
        var obj = identificar(id, $scope.Facturas);
        swal({
            title: "Confirmar Eliminación",
            text: "¿Esta seguro de borrar la factura?",
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
                Borrar(obj);
            } else {
                swal("Cancelado", "La factura no se borrará", "error");
            }
        });
    }

    $scope.Imprimir = function(ele){
        $scope.Orden = {
            orden_venta_consecutivo: ele.consecutivo,
            cliente: ele.cliente,
            productos: ele.productos
        }
        $scope.remision = ele.remision;
        $scope.ordenCompra = ele.ordenCompra;
        $scope.subtotal = ele.subtotal;
        $scope.iva = ele.iva;
        $scope.valorIva = ele.valorIva;
        $scope.total = ele.total;
        if(!$scope.remision){
            $('#remision').html('');
        }
        if(!$scope.ordenCompra){
            $('#ordenCompra').html('');
        }

        var w = window.open();
        var d = w.document.open();
        var eleToPrint = $('#container')[0];
        d.append(eleToPrint);

        webServer.getResource('facturas', {} , 'get')
        .then(function(data){
            w.print();
            w.close();
            $('#superconatiner')[0].append(eleToPrint);
        }, function(data){
            w.print();
            w.close();
            $('#superconatiner')[0].append(eleToPrint);
        });
    }

    function Borrar(ele){
        preloader.estado = true;
        webServer.getResource('facturas/'+ele._id, {}, 'put')
        .then(function(data){
            swal('Ok', data.data.message, 'success');
            preloader.estado = false;
            $scope.Facturas.splice(ele.index, 1);
        }, function(data){
            swal('Error', data.data.message, 'error');
            preloader.estado = false;
        })
    }

    function identificar(id, arreglo){
        var obj = null;
        arreglo.forEach(function(ele, index){
            if(ele._id == id){
                obj = ele;
                obj.index = index;
            }
        });
        return obj;
    }


});
