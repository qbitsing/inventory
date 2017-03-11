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

	var casillaDeBotonesModal = '<div>'+BotonesTabla.BorrarModal+'</div>';
    $scope.gridOptionsModal = {
        columnDefs: [
            {
                field: 'nombre',
                width:'50%',
                minWidth: 200
            },
            { 
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotonesModal,
                width:'50%',
                minWidth: 200
            }
        ]
    }
    angular.extend($scope.gridOptionsModal , Tabla);

    $scope.AbrirModalCategorias=function(){
        $('#modal2').modal('open');
    }

    $scope.EnviarCategoria=function(){
        webServer
        .getResource('categorias',$scope.categoria,'post')
        .then(function(data){
            $scope.Categorias.push($scope.categoria);
            $scope.categoria={};
            alert('Categoria registrada correctamente');
        },function(data){
            console.log(data.data.message);
        });
    }
    function listarCategorias(){
        webServer
        .getResource('categorias',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Categorias=data.data.datos;
                $scope.gridOptionsModal.data = $scope.Categorias;
            }else{
                $scope.Categorias=[];
                $scope.gridOptionsModal.data = $scope.Categorias;
            }
        },function(data){
            console.log(data.data.message);
            $scope.Categorias=[];
            $scope.gridOptionsModal.data = $scope.Categorias;
        });
    }
    listarCategorias();
});
