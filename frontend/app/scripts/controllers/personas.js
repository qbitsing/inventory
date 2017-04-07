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
    $scope.Detallemodal={};
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
                $scope.Detallemodal.titulo='Notificacion de registro';
                $scope.Detallemodal.mensaje='Persona registrada correctamente';
            }else{
                $scope.Personas[$scope.Persona.index] = $scope.Persona;
                $scope.Detallemodal.titulo='Notificacion de actualización';
                $scope.Detallemodal.mensaje='Persona actualizada correctamente';
            }
            $scope.Persona={};
        },function(data){
            $scope.Detallemodal.titulo='Notificacion de error';
            $scope.Detallemodal.mensaje=data.data.message;
            console.log(data);
        });
        $('#modalNotificacion').modal('open');
    }
    $scope.abrirModal=function(_id){
        $scope.Detallemodal.id=_id;
        $scope.Detallemodal.titulo='Confirmar eliminación';
        $scope.Detallemodal.mensaje='¿Esta seguro que desea eliminar esta persona?';
        $('#modalConfirmacion').modal('open');
    }
    $scope.Borrar=function(id){
        $('#modalConfirmacion').modal('close');
        $scope.Detallemodal={};
         webServer
        .getResource('orden_venta/'+id,{},'delete')
        .then(function(data){
            $scope.Entradas.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.Entradas.splice(ele.index,1);
                }
            });
            $scope.Detallemodal.mensaje='La persona se ha eliminado exitosamente';
        },function(data){
            $scope.Detallemodal.mensaje=data.data.message;
            console.log(data.data.message);
        });
        $scope.Detallemodal.titulo='Notificacion de eliminación';
        $('#modalNotificacion').modal('open');
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
    
    $scope.Editar = function(id){
        $scope.panel_title_form = "Edicion de clientes y proveedores";
        $scope.button_title_form = "Editar Persona";
        $scope.Persona = IdentificarPersona(id,$scope.Personas);
        console.log($scope.Persona);  
        if($scope.Persona.ciudad){
            $scope.Persona.departamento = $scope.Persona.ciudad.departamento._id;
        }
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
});