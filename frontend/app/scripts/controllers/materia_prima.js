'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MateriaPrimaCtrl
 * @description
 * # MateriaPrimaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MateriaPrimaCtrl', function ($state, $scope, $timeout, Tabla, BotonesTabla, webServer, preloader) {
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
        });
    });
    $scope.preloader = preloader;
	$scope.panelAnimate='';
	$scope.pageAnimate='';
    if ($scope.Usuario.rol=='Contador') {
        $state.go('Home');
    }
	$timeout(function () {
		$scope.pageAnimate='pageAnimate';
		$scope.panelAnimate='panelAnimate';
	},100);
	$scope.panel_title_form = "Registro de Materia Prima";
	$scope.button_title_form = "Registrar Materia Prima";
	$scope.Materia={};
    $scope.Materia.unidad_medida={};
	var casillaDeBotones = '<div>'+BotonesTabla.Detalles;
    if ($scope.Usuario.rol=='Super Administrador') {
        casillaDeBotones+=BotonesTabla.Editar+BotonesTabla.Borrar;
    }
    casillaDeBotones+='</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                field: 'nombre',
                width:'30%',
                minWidth: 160
            },
            { 
                field: 'min_stock',
                width:'20%',
                minWidth: 160
            },
            {
                name:'cantidad',
                width:'20%',
                cellTemplate: '<div>{{row.entity.cantidad}} {{row.entity.unidad_medida.nombre}}</div>',
                minWidth: 250
            },
            { 
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'30%',
                minWidth: 230
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);
    $scope.EnviarMateria=function(){
        $scope.preloader.estado = true;
    	var ruta="";
        var metodo="";
        if ($scope.panel_title_form=="Registro de Materia Prima") {
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
                $scope.Materia._id=data.data.datos._id;
                $scope.Materias.push($scope.Materia);
            }else{
                $scope.Materias[$scope.Materia.index] = $scope.Materia;
                $scope.panel_title_form = "Registro de Materia Prima";
                $scope.button_title_form = "Registrar Materia Prima";
            }
            $scope.preloader.estado = false;
            sweetAlert("Completado...", data.data.message , "success");
            $scope.Materia={};
        },function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message , "error");
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
    function scroll(){
         $("html, body").animate({
            scrollTop: 0
        }, 1000); 
    }
    $scope.Editar = function(id){
        $scope.Materia=IdentificarMateria(id,$scope.Materias);
        $scope.panel_title_form = "Edicion de Materia Prima";
        $scope.button_title_form = "Actualizar Materia Prima";
        scroll();
    }
    $scope.CancelarEditar=function(){
        $scope.panel_title_form = "Registro de Materia Prima";
        $scope.button_title_form = "Registrar Materia Prima";
        $scope.Materia={};
    }
    /*Validaciones de numeros*/
    $scope.validarNumeroMinStock=function(id){
        if ($scope.Materia.min_stock<1) {
            $scope.Materia.min_stock=1;
        }
    }
    $scope.validarNumero=function(id){
        if ($scope.Materia.cantidad<1) {
            $scope.Materia.cantidad=1;
        }
    }
    /*Fin de las validaciones*/
    $scope.abrirModal=function(_id){
        swal({
            title: "Confirmar Eliminación",
            text: "¿Esta seguro de borrar la materia prima?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, Borrar!",
            cancelButtonText: "No, Cancelar!",
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
        },
        function(){
            Borrar(_id);
        });
    }
    function Borrar(id){
        webServer
        .getResource('fabricacion/'+id,{},'delete')
        .then(function(data){
            $scope.Materias.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.Materias.splice(ele.index,1);
                }
            });
            swal("Completado...", data.data.message , "success");
        },function(data){
            swal("Oops...", data.data.message , "error");
        });
    }
    function listarmaterias(){
        $scope.preloader.estado = true;
        webServer
        .getResource('materiaPrima',{},'get')
        .then(function(data){
            $scope.Materias=data.data.datos;
            $scope.gridOptions.data = $scope.Materias;
            $scope.preloader.estado = false;
        },function(data){
            console.log(data.data.message);
            $scope.Materias=[];
            $scope.gridOptions.data = $scope.Materias;
            $scope.preloader.estado = false;
        });
    }
    listarmaterias();
    function IdentificarMateria (id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    index: index,
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
})