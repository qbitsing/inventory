'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EmpleadosCtrl
 * @description
 * # EmpleadosCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('EmpleadosCtrl', function ($scope, $timeout, Tabla, BotonesTabla, webServer){
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
    $scope.panelAnimate='';
    $scope.pageAnimate='';  
    $timeout(function(){
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de Empleados";
    $scope.button_title_form = "Registrar Empleado";
    $scope.Empleado={};
    $scope.Empleado.rol=null;
    $scope.Detallemodal={};
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
                minWidth: 230
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);

    $scope.EnviarEmpleado=function(){
        switch($scope.Empleado.rol) {
            case 'super_administrador':
                $scope.Empleado.super_administrador=true;
                break;
            case 'contador':
                $scope.Empleado.contador=true;
                break;
            case 'almacenista':
                $scope.Empleado.almacenista=true;
                break;
            case 'empleado':
                $scope.Empleado.empleado=true;
                break;
        }
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
                $scope.Empleados.push($scope.Empleado);
                $scope.Detallemodal.titulo='Notificacion de registro';
                $scope.Detallemodal.mensaje='Empleado registrado correctamente';
            }else{
                $scope.Empleados[$scope.Empleado.index] = $scope.Empleado;
                $scope.Detallemodal.titulo='Notificacion de actualización';
                $scope.Detallemodal.mensaje='Empleado actualizado correctamente';
            }
        },function(data){
            $scope.Detallemodal.titulo='Notificacion de eror';
            $scope.Detallemodal.mensaje=data.data.message;
            alert(data.data.message);
        });
        $('#modalNotificacion').modal('open');
    }
    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Empleados.find(function(ele){
            if(ele.documento == id){
                return ele;
            }
        });
        $('#modalDetalles').modal('open');
    }
    $scope.abrirModal=function(_id){
        $scope.Detallemodal.id=_id;
        $scope.Detallemodal.titulo='Confirmar eliminación';
        $scope.Detallemodal.mensaje='¿Esta seguro que desea eliminar el empleado?';
        $('#modalConfirmacion').modal('open');
    }
    $scope.Borrar=function(id){
        $('#modalConfirmacion').modal('close');
        $scope.Detallemodal={};
        webServer
        .getResource('empleados/'+id,{},'delete')
        .then(function(data){
            $scope.Empleados.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.Empleados.splice(ele.index,1);
                }
            });
            $scope.Detallemodal.mensaje='El empleado se ha eliminado exitosamente';
        },function(data){
            $scope.Detallemodal.mensaje=data.data.message;
            console.log(data.data.message);
        });
        $scope.Detallemodal.titulo='Notificacion de eliminación';
        $('#modalNotificacion').modal('open');
    }
    $scope.Editar = function(id){
        $scope.Empleado = IdentificarPersona(id,$scope.Empleados);
        if($scope.Empleado.super_administrador){
            $scope.Empleado.rol='super_administrador';
        }else if($scope.Empleado.contador){
            $scope.Empleado.rol='contador';
        }else if($scope.Empleado.almacenista){
            $scope.Empleado.rol='almacenista';
        }else if($scope.Empleado.empleado){
            $scope.Empleado.rol='empleado';
        }
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
    function IdentificarPersona (id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    index : index,
                    _id : ele._id,
                    documento : ele.documento,
                    nombre : ele.nombre,
                    apellidos : ele.apellidos,
                    direccion : ele.direccion,
                    telefono : ele.telefono,
                    correo : ele.correo,
                    almacenista : ele.almacenista,
                    contador : ele.contador,
                    empleado : ele.empleado,
                    cargo : ele.cargo
                };
            }
        });
        return obj;
    }
});