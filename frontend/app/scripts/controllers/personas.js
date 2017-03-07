'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ClientesCtrl
 * @description
 * # ClientesCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('PersonasCtrl', function ($scope, $timeout, $state, SesionUsuario, webServer, Tabla, BotonesTabla) {
    if(SesionUsuario.obtenerSesion()==null){
        $state.go('Login');
    }
    $scope.panelAnimate='';
    $scope.pageAnimate='';  
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de Personas";
    $scope.button_title_form = "Registrar Persona";
    $scope.Persona={};
    $scope.Persona.rol={};
    var modalInstance=null;
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
                name: 'telefono',
                width:'20%',
                minWidth: 160
            },
            { 
                field: 'contacto',
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


    $scope.EnviarPersona=function(){
        var ruta="";
        var metodo="";
        if ($scope.panel_title_form=="Registro de Personas") {
            ruta="personas";
            metodo="post";
        }else{
            ruta="personas/"+$scope.Persona.documento;
            metodo="put";
        }
        webServer
        .getResource(ruta,$scope.Persona,metodo)
        .then(function(data){
            console.log(data);
        },function(data){
            alert(data.data.message);
        });
    }

    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Personas.find(function(ele){
            if(ele.documento == id){
                return ele;
            }
        });
        $('#modal1').modal('open');
    }

    function listarpersonas(){
        webServer
        .getResource('personas',{proveedor:true,cliente:true},'get')
        .then(function(data){
            if(data.data){
                $scope.Personas=data.data.datos;
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