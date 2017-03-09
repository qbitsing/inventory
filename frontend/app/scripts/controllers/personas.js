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
    $scope.panel_title_form = "Registro de clientes y proveedores";
    $scope.button_title_form = "Registrar Persona";
    $scope.Persona={};
    $scope.Persona.rol={};
    var modalInstance=null;
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Editar+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            { 
                name: 'documento o nit',field: 'documento',
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
                field: 'contacto',
                width:'20%',
                minWidth: 160
            },
            { 
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'20%',
                minWidth: 160
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);

    $scope.EnviarPersona=function(){
        var ruta="";
        var metodo="";
        if ($scope.panel_title_form=="Registro de clientes y proveedores") {
            ruta="personas";
            metodo="post";
        }else{
            ruta="personas/"+$scope.Persona._id;
            metodo="put";
        }
        webServer
        .getResource(ruta,$scope.Persona,metodo)
        .then(function(data){
            if($scope.panel_title_form=="Registro de clientes y proveedores"){
                $scope.Personas.push($scope.Persona);
            }else{
                $scope.Personas[$scope.Persona.index] = $scope.Persona;
            }
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
    
    $scope.Editar = function(id){
        $scope.Persona = $scope.Personas.find(function(ele){
            if(ele.documento == id){
                return ele;
            }
        });
        console.log($scope.Persona);
        $scope.panel_title_form = "Edicion de clientes y proveedores";
        $scope.button_title_form = "Editar Persona";
    }
    $scope.CancelarEditar=function(){
        $scope.Persona={};
        $scope.panel_title_form = "Registro de clientes y proveedores";
        $scope.button_title_form = "Registrar Persona";
    }

    function listarPersonas(){
        webServer
        .getResource('personas',{proveedor:true,cliente:true},'get')
        .then(function(data){
            if(data.data){
                $scope.Personas = data.data.datos;
                $scope.gridOptions.data = data.data.datos;
            }else{
                $scope.gridOptions.data = [];
            }
        },function(data){
            console.log(data);
        });
    }
    function listarCiudades(){
        webServer
        .getResource('ciudades',{},'get')
        .then(function(data){
            if(data.data.datos){
                $scope.Ciudades=data.data.datos;
            }else{
                $scope.Ciudades=[];
            }
        },function(data){
            alert(data.data.message);
        });
    }
    function listarDepartamentos(){
        webServer
        .getResource('departamentos',{},'get')
        .then(function(data){
            if(data.data.datos){
                $scope.Departamentos=data.data.datos;
                console.log($scope.Departamentos);
            }else{
                $scope.Departamentos=[];
            }
        },function(data){
            alert(data.data.message);
        });
    }
    listarPersonas();
    listarDepartamentos();
    listarCiudades();
});