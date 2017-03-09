'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EmpleadosCtrl
 * @description
 * # EmpleadosCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('EmpleadosCtrl', function ($scope, $timeout, $state, SesionUsuario, Tabla, BotonesTabla, webServer) {
	if(SesionUsuario.obtenerSesion()==null){
        $state.go('Login');
    }
    $scope.panelAnimate='';
    $scope.pageAnimate='';  
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de Empleados";
    $scope.button_title_form = "Registrar Empleado";
    $scope.Empleado={};

    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Editar+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            { 
                field: 'documento o nit',field: 'documento',
                width:'20%',
                minWidth: 160
            },
            {
                field: 'nombre',
                width:'20%',
                minWidth: 160
            },
            { 
                field: 'telefono',
                width:'20%',
                minWidth: 160
            },
            { 
                field: 'cargo',
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

    $scope.EnviarEmpleado=function(){
        var ruta="";
        var metodo="";
        if ($scope.panel_title_form=="Registro de Empleados") {
            ruta="personas";
            metodo="post";
        }else{
            ruta="personas/"+$scope.Empleado._id;
            metodo="put";
        }
        webServer
        .getResource(ruta,$scope.Empleado,metodo)
        .then(function(data){
            if($scope.panel_title_form=="Registro de Empleados"){
                $scope.Empleados.push($scope.Persona);
            }else{
                $scope.Empleados[$scope.Persona.index] = $scope.Persona;
            }
        },function(data){
            alert(data.data.message);
        });
    }
    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Empleados.find(function(ele){
            if(ele.documento == id){
                return ele;
            }
        });
        $('#modal1').modal('open');
    }
    $scope.Editar = function(id){
        $scope.Empleado = $scope.Personas.find(function(ele){
            if(ele.documento == id){
                return ele;
            }
        });
        $scope.panel_title_form = "Edicion de Empleados";
        $scope.button_title_form = "Editar Empleado";
    }
    $scope.CancelarEditar=function(){
        $scope.Empleado={};
        $scope.panel_title_form = "Registro de Empleados";
        $scope.button_title_form = "Registrar Empleado";
    }
    function listarpersonas(){
        webServer
        .getResource('personas',{empleado:true},'get')
        .then(function(data){
            if(data.data){
                $scope.Empleados=data.data.datos;
                $scope.gridOptions.data = data.data.datos;
            }else{
                $scope.gridOptions.data =[];
            }
        },function(data){
            alert(data.data.message);
        });
    }
    listarpersonas();
});