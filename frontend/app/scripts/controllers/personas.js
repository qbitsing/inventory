'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ClientesCtrl
 * @description
 * # ClientesCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('PersonasCtrl', function ($scope, $timeout, webServer, Tabla, BotonesTabla, preloader) {
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
    $scope.preloader.estado = false;
    $scope.panelAnimate='';
    $scope.pageAnimate='';  
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de clientes y proveedores";
    $scope.button_title_form = "Registrar Persona";
    $scope.Persona={};
    $scope.Persona.proveedor=false;
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
                minWidth: 230
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);
    $scope.EnviarPersona=function(){
        $scope.preloader.estado = true;
        var ruta="";
        var metodo="";
        if ($scope.panel_title_form=="Registro de clientes y proveedores") {
            ruta="personas";
            metodo="post";
        }else{
            ruta="personas/"+$scope.Persona._id;
            metodo="put";
        }
        if(!$scope.Persona.proveedor){
            $scope.Persona.proveedorproductos=false;
            $scope.Persona.proveedorfabricacion=false;
        }
        webServer
        .getResource(ruta,$scope.Persona,metodo)
        .then(function(data){
            if($scope.panel_title_form=="Registro de clientes y proveedores"){
                $scope.Persona._id=data.data.datos._id;
                $scope.Personas.push($scope.Persona);
            }else{
                $scope.Personas[$scope.Persona.index] = $scope.Persona;
            }
            $scope.Persona={};
            $scope.panel_title_form = "Registro de clientes y proveedores";
            $scope.button_title_form = "Registrar Persona";
            $scope.preloader.estado = false;
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message , "error");
            console.log(data);
        });
    }
    $scope.abrirModal=function(_id){
        swal({
            title: "Confirmar Eliminación",
            text: "¿Esta seguro de borrar esta persona?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, Borrar!",
            cancelButtonText: "No, Cancelar!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm){
            if (isConfirm) {
                Borrar(_id);
            } else {
                swal("Cancelado", "La persona no se borrará", "error");
            }
        });
    }
    function Borrar(id){
        $scope.preloader.estado = true;
        webServer
        .getResource('orden_venta/'+id,{},'delete')
        .then(function(data){
            $scope.Personas.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.Personas.splice(ele.index,1);
                }
            });
            $scope.preloader.estado = false;
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message , "error");
        });
    }
    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Personas.find(function(ele){
            if(ele._id == id){
                return ele;
            }
        });
        $scope.Detalle.rol='';
        if($scope.Detalle.cliente){
            $scope.Detalle.rol='Cliente';
        }
        if($scope.Detalle.proveedor){
            if($scope.Detalle.rol!=''){
                $scope.Detalle.rol+=', ';
            }
            $scope.Detalle.rol+='Proveedor';
        }
        $scope.Detalle.rol+='.';
        $('#modalDetalles').modal('open');
    }
    function scroll(){
         $("html, body").animate({
            scrollTop: 0
        }, 1000); 
    }
    $scope.Editar = function(id){
        $scope.panel_title_form = "Edicion de clientes y proveedores";
        $scope.button_title_form = "Actualizar Persona";
        $scope.Persona = IdentificarPersona(id,$scope.Personas);
        scroll();
        console.log($scope.Persona);  
        if($scope.Persona.ciudad){
            $scope.Persona.departamento = $scope.Persona.ciudad.departamento._id;
        }
    }
    
    $scope.CancelarEditar=function(){
        $scope.Persona={};
        $scope.Persona.proveedor=false;
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
            listarDepartamentos();
        },function(data){
            console.log(data);
            listarDepartamentos();
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
                $scope.Persona.departamento = $scope.Departamentos[0]._id;
            }else{
                $scope.Departamentos=[];
            }
            listarCiudades();
        },function(data){
            console.log(data.data);
            listarCiudades();
        });
    }
    listarPersonas();
    function IdentificarPersona (id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    index: index,
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
})