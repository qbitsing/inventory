'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MateriaPrimaCtrl
 * @description
 * # MateriaPrimaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MateriaPrimaCtrl', function ($scope, $timeout, Tabla, BotonesTabla, webServer) {
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
            }
        );
    });
	$scope.panelAnimate='';
	$scope.pageAnimate='';  
	$timeout(function () {
		$scope.pageAnimate='pageAnimate';
		$scope.panelAnimate='panelAnimate';
	},100);
	$scope.panel_title_form = "Registro de Materia Prima";
	$scope.button_title_form = "Registrar Materia Prima";
	$scope.Materia={};
    $scope.Materia.unidad_medida={};
	var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Editar+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                field: 'nombre',
                width:'20%',
                minWidth: 160
            },
            { 
                name: 'unidad de medida',field: 'unidad_medida.nombre',
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
            $scope.Unidades.forEach(function(ele, index){
                if(ele._id==$scope.Materia.unidad_medida._id){
                    $scope.Materia.unidad_medida=ele;
                }
            });
            if($scope.panel_title_form=="Registro de Materia Prima"){
                $scope.Materias.push($scope.Materia);
                alert('Materia prima registrada correctamente');
            }else{
                $scope.Materias[$scope.Materia.index] = $scope.Materia;
                alert('Materia prima actualizada correctamente');
                $scope.panel_title_form = "Registro de Materia Prima";
                $scope.button_title_form = "Registrar Materia Prima";
            }
            $scope.Materia={};
        },function(data){
            console.log(data.data.message);
        });
    }
    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Materias.find(function(ele){
            if(ele._id == id){
                return ele;
            }
        });
        $('#modalDetalles').modal('open');
    }
    $scope.Editar = function(id){
        $scope.Materia=IdentificarMateria(id,$scope.Materias);
        $scope.panel_title_form = "Edicion de Materia Prima";
        $scope.button_title_form = "Editar Materia Prima";
    }
    $scope.CancelarEditar=function(){
        $scope.panel_title_form = "Registro de Materia Prima";
        $scope.button_title_form = "Registrar Materia Prima";
        $scope.Materia={};
    }
    
    function listarmaterias(){
        webServer
        .getResource('materiaPrima',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Materias=data.data.datos;
                $scope.gridOptions.data = $scope.Materias;
            }else{
                $scope.Materias=[];
                $scope.gridOptions.data = $scope.Materias;
            }
        },function(data){
            console.log(data.data.message);
            $scope.Materias=[];
            $scope.gridOptions.data = $scope.Materias;
        });
    }
    listarmaterias();
    function IdentificarMateria (id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    _id : ele._id,
                    nombre : ele.nombre,
                    marca : ele.marca,
                    unidad_medida : ele.unidad_medida,
                    min_stock : ele.min_stock,
                    cantidad : ele.cantidad
                };
            }
        });
        return obj;
    }
});