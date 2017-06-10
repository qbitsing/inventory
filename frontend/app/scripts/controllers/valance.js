'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ValanceCtrl
 * @description
 * # ValanceCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('ValanceCtrl', function ($scope, preloader, webServer, $timeout) {
	$scope.panelAnimate='';
	$scope.pageAnimate='';
	$scope.valance = {};
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
    		},
    		{
    			field: 'unidad_medida.nombre',
    			name: 'UNIDAD',
    			minWidth: 160
    		},
    		{
    			field: 'precio',
    			name: 'V. UNITARIO',
    			minWidth: 160
    		},
    		{
    			field: 'precioCalculado',
    			name: 'V. TOTAL',
    			minWidth: 160
    		}
    	]
    };



    webServer.getResource('productos/valance', {}, 'get')
    .then(function(data){
    	$scope.valance = data.data;
    	$scope.gridOptions.data = $scope.valance.productos;
    }, function(data){
    	
    });

});
