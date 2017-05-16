'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:FacturaCtrl
 * @description
 * # FacturaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('FacturaCtrl', function ($scope, $state, preloader, server, webServer, numeroaletras) {
    $scope.server = server;
    $scope.fecha = fechaHoy();
    $scope.iva = 19;
    $scope.valorIva = 0;
    $scope.subtotal = 0;
    $scope.total = 0;
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
            orden: 'orden '+$scope.Orden._id,
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
            sweetAlert('ok', data.data.message, 'success');
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
        sweetAlert('Oops...', data.data.message, 'error');
    });

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

});
