'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ClientesCtrl
 * @description
 * # ClientesCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('PersonasCtrl', function ($scope, $timeout, webServer, Tabla, BotonesTabla) {
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
                alert('Persona registrada correctamente');
            }else{
                $scope.Personas[$scope.Persona.index] = $scope.Persona;
                alert('Persona actualizada correctamente');
            }
            $scope.Persona={};
        },function(data){
            console.log(data);
        });
    }

    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Personas.find(function(ele){
            if(ele._id == id){
                return ele;
            }
        });
        $('#modalDetalles').modal('open');
    }
    
    $scope.Editar = function(id){
        $scope.panel_title_form = "Edicion de clientes y proveedores";
        $scope.button_title_form = "Editar Persona";
        $scope.Persona = IdentificarPersona(id,$scope.Personas);
        $scope.Persona.departamento = $scope.Persona.ciudad.departamento._id; 
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
            console.log(data.data);
        });
    }
    function listarDepartamentos(){
        webServer
        .getResource('departamentos',{},'get')
        .then(function(data){
            if(data.data.datos){
                $scope.Departamentos=data.data.datos;
            }else{
                $scope.Departamentos=[];
            }
        },function(data){
            console.log(data.data);
        });
    }
    listarPersonas();
    listarDepartamentos();
    listarCiudades();
    function IdentificarPersona (id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    _id : ele._id,
                    documento : ele.documento,
                    nombre : ele.nombre,
                    apellidos : ele.apellidos,
                    direccion : ele.direccion,
                    telefono : ele.telefono,
                    correo : ele.correo,
                    proveedor : ele.proveedor,
                    cliente : ele.cliente,
                    ciudad : ele.ciudad,
                    contacto : ele.contacto,
                    fax : ele.fax
                };
            }
        });
        return obj;
    }
});