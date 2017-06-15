'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:HistorialCtrl
 * @description
 * # HistorialCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('HistorialCtrl', function ($scope, preloader, webServer, $timeout, server) {
	$scope.panelAnimate='';
	$scope.pageAnimate='';
    $scope.server = server;
    $scope.datos = [];
	$timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
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
    			field: 'unidad_medida.nombre',
    			name: 'UNIDAD',
    			minWidth: 160
    		},
    		{
    			field: 'cantidad_entrada',
    			name: 'cantidad que entro',
    			minWidth: 160
    		},
    		{
    			field: 'cantidad_salida',
    			name: 'cantidad que salio',
    			minWidth: 160
    		},
    		
    	]
    };

    $scope.buscar = function(){
    	preloader.estado = true;
    	var fechaInit = $scope.fechaInit.getFullYear()+ '-' + ($scope.fechaInit.getMonth() + 1) + '-' +$scope.fechaInit.getDate();
    	var fechaFinal = $scope.fechaFinal.getFullYear()+ '-' + ($scope.fechaFinal.getMonth() + 1) + '-' +$scope.fechaFinal.getDate();
	    webServer.getResource('historial/'+fechaInit+'/'+fechaFinal, {}, 'get')
	    .then(function(data){
	    	preloader.estado = false;
	    	$scope.datos = data.data.productos.concat(data.data.materia);
	    	$scope.gridOptions.data = $scope.datos;
	    }, function(data){
	    	preloader.estado = false;
	    });
    }



    /*$scope.print = function(){
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

    }*/

});
