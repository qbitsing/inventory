'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ProductosCtrl
 * @description
 * # ProductosCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('ProductosCtrl', function ($scope, $timeout, Tabla, BotonesTabla, webServer) {
	$scope.panelAnimate='';
	$scope.pageAnimate='';  
	$timeout(function () {
		$scope.pageAnimate='pageAnimate';
		$scope.panelAnimate='panelAnimate';
	},100);
	$scope.panel_title_form = "Registro de Productos";
	$scope.button_title_form = "Registrar Producto";
	$scope.Producto={};

    function listarCategorias(){
        webServer
        .getResource('categorias',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Categorias=data.data.datos;
            }else{
                $scope.Categorias=[];
            }
        },function(data){
            console.log(data.data.message);
            $scope.Categorias=[];
        });
    }
    listarCategorias();
});
