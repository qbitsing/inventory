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
    $scope.panel_title_form_unidades = "Registro de Unidades de Medida";
    $scope.button_title_form_unidades = "Registrar Unidad de Medida";
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
        $('#modal1').modal('open');
    }
    $scope.Editar = function(id){
        $scope.Materia=IdentificarMateria(id,$scope.Materias);
        $scope.panel_title_form = "Edicion de Materia Prima";
        $scope.button_title_form = "Editar Materia Prima";
    }
    $scope.CancelarEditar=function(){
        $scope.Materia={};
        $scope.panel_title_form = "Registro de Materia Prima";
        $scope.button_title_form = "Registrar Materia Prima";
    }
    $scope.EnviarUnidad=function(){
        var ruta="";
        var metodo="";
        if ($scope.panel_title_form_unidades=="Registro de Unidades de Medida") {
            ruta="unidades";
            metodo="post";
        }else{
            ruta="unidades/"+$scope.Unidad_de_medida._id;
            metodo="put";
        }
        webServer
        .getResource(ruta,$scope.Unidad_de_medida,metodo)
        .then(function(data){
            if($scope.panel_title_form_unidades=="Registro de Unidades de Medida"){
                $scope.Unidades.push($scope.Unidad_de_medida);
            }else{
                $scope.Unidades[$scope.Unidad_de_medida.index] = $scope.Unidad_de_medida;
            }
            $scope.Unidad_de_medida={};
        },function(data){
            console.log(data.data.message);
        });
    }
    $scope.AbrirModalUnidades=function(){
        $('#modal2').modal('open');
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
                $scope.Materias=[];
            }
        },function(data){
            console.log(data.data.message);
        });
    }
    function listarunidades(){
        webServer
        .getResource('unidades',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Unidades=data.data.datos;
                $scope.gridOptionsModal.data =data.data.datos;
            }else{
                $scope.gridOptionsModal.data =[];
            }
        },function(data){
            console.log(data.data.message);
        });
    }
    listarmaterias();
    listarunidades();

    function IdentificarUnidad (id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    _id : ele._id,
                    nombre : ele.nombre
                };
            }
        });
        return obj;
    }
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