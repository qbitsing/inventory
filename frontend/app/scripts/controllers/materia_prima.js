'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MateriaPrimaCtrl
 * @description
 * # MateriaPrimaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MateriaPrimaCtrl', function ($scope, $timeout, $state, SesionUsuario, Tabla, BotonesTabla, webServer) {
    if(SesionUsuario.obtenerSesion()==null){
		$state.go('Login');
	}
	$scope.panelAnimate='';
	$scope.pageAnimate='';  
	$timeout(function () {
		$scope.pageAnimate='pageAnimate';
		$scope.panelAnimate='panelAnimate';
	},100);
	$scope.panel_title_form = "Registro de Materia Prima";
	$scope.button_title_form = "Registrar Materia Prima";
	$scope.Producto={};
	var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Editar+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                field: 'nombre',
                width:'20%',
                minWidth: 160
            },
            { 
                name: 'unidad de medida',field: 'unidad_medida',
                width:'20%',
                minWidth: 160
            },
            { 
                field: 'min_stock',
                width:'20%',
                minWidth: 160
            },
            { 
                field: 'cantidad',
                width:'20%',
                minWidth: 160
            },
            { 
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'25%',
                minWidth: 180
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);
    $scope.EnviarMateria=function(){
    	var ruta="";
        var metodo="";
        if ($scope.panel_title_form=="Registro de Materia Prima") {
        	$scope.Materia.cantidad=0;
            ruta="materiaPrima";
            metodo="post";
        }else{
            ruta="materiaPrima/"+$scope.Materia._id;
            metodo="put";
        }
        webServer
        .getResource(ruta,$scope.Materia,metodo)
        .then(function(data){
            if($scope.panel_title_form=="Registro de Materia Prima"){
                $scope.Materias.push($scope.Materia);
            }else{
                $scope.Materias[$scope.Materia.index] = $scope.Materia;
            }
        },function(data){
            alert(data.data.message);
        });
    }
    function listarmaterias(){
        webServer
        .getResource('materiaPrima',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Materias=data.data.datos;
                $scope.gridOptions.data = data.data.datos;
            }else{
                $scope.gridOptions.data =[];
            }
        },function(data){
            alert(data.data.message);
        });
    }
    function listarunidades(){
        webServer
        .getResource('unidades',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Unidades=data.data.datos;
            }else{
                $scope.gridOptions.data =[];
            }
        },function(data){
            alert(data.data.message);
        });
    }
    listarmaterias();
    listarunidades
  });
