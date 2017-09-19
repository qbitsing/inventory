'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ValanceCtrl
 * @description
 * # ValanceCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('ValanceCtrl', function ($scope, preloader, webServer, $timeout, server, Tabla) {
	$scope.panelAnimate='';
	$scope.pageAnimate='';
	$scope.valance = {};
    $scope.server = server;
	$timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.convertirFecha = function(fecha){
    	var dias = new Array('domingo','lunes','martes','miercoles','juev es','viernes','sabado');
    	var meses = new Array(
    			'Enero',
    			'Febrero',
    			'Marzo',
    			'Abril',
    			'Mayo',
    			'Junio',
    			'Julio',
    			'Agosto',
    			'Septiembre',
    			'Octubre',
    			'Noviembre',
    			'Diciembre'
    		);
        var date = new Date(fecha);
        var dateConvert = dias[date.getDay()] + ' ' + date.getDate() + ' de ' + meses[date.getMonth()] + ' de ' + date.getFullYear();
        return dateConvert;
    }
	$scope.fecha = $scope.convertirFecha(Date.now());
    $scope.gridOptions = {
    	columnDefs: [
    		{
    			field: 'nombre',
    			name: 'ARTICULO',
    			minWidth: 260
    		},
    		{
    			field: 'marca',
    			name: 'MARCA',
    			minWidth: 160
    		},
    		{
    			field: 'codigo',
    			name: 'CODIFICACION',
    			minWidth: 160
    		},
    		{
    			field: 'cantidad',
    			name: 'SALDO',
    			minWidth: 160
    		}
    	]
    };
    if ($scope.Usuario.rol!='Almacenista') {
        $scope.gridOptions.columnDefs.push(
            {
                field: 'precio',
                name: 'V. UNITARIO',
                minWidth: 160
            }
        );
        $scope.gridOptions.columnDefs.push(
            {
                field: 'precioCalculado',
                name: 'V. TOTAL',
                minWidth: 160
            }
        );
    }
    angular.extend($scope.gridOptions , Tabla);

    webServer.getResource('productos/valance', {}, 'get')
    .then(function(data){
    	$scope.valance = data.data;
    	$scope.gridOptions.data = $scope.valance.productos;
    }, function(data){
    	
    });

    $scope.print = function(){
        var w = window.open();
        var d = w.document.open();
        var ele = $('#container')[0];
        d.appendChild(ele);
        webServer.getResource('productos/valance', {}, 'get')
        .then(function(data){
            w.print();
            w.close();
            $('#superContainer')[0].appendChild(ele);
        }, function(data){
            w.print();
            w.close();
            $('#superContainer')[0].appendChild(ele);
        });

    }

});
