'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EmpleadosCtrl
 * @description
 * # EmpleadosCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('EmpleadosCtrl', function ($state, $scope, $timeout, Tabla, BotonesTabla, webServer, preloader){
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
    if ($scope.Usuario.rol=='Contador' || $scope.Usuario.rol=='Almacenista') {
        $state.go('Home');
    } 
    $timeout(function(){
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de Empleados";
    $scope.button_title_form = "Registrar Empleado";
    $scope.Empleado={};
    $scope.Empleado.rol=null;
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
                width:'15%',
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
        $scope.preloader.estado = true;
        switch($scope.Empleado.rol) {
            case 'super_administrador':
                $scope.Empleado.super_administrador=true;
                $scope.Empleado.contador=false;
                $scope.Empleado.almacenista=false;
                $scope.Empleado.empleado=false;
                break;
            case 'contador':
                $scope.Empleado.contador=true;
                $scope.Empleado.super_administrador=false;
                $scope.Empleado.almacenista=false;
                $scope.Empleado.empleado=false;
                break;
            case 'almacenista':
                $scope.Empleado.almacenista=true;
                $scope.Empleado.contador=false;
                $scope.Empleado.super_administrador=false;
                $scope.Empleado.empleado=false;
                break;
            case 'empleado':
                $scope.Empleado.empleado=true;
                $scope.Empleado.contador=false;
                $scope.Empleado.super_administrador=false;
                $scope.Empleado.almacenista=false;
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
                $scope.Empleado._id=data.data.datos._id;
                $scope.Empleados.push($scope.Empleado);
            }else{
                $scope.Empleados[$scope.Empleado.index] = $scope.Empleado;
            }
            $scope.Empleado ={};
            $scope.panel_title_form = "Registro de Empleados";
            $scope.button_title_form = "Registrar Empleado";
            $scope.preloader.estado = false;
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message , "error");
        });
    }
    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Empleados.find(function(ele){
            if(ele._id == id){
                return ele;
            }
        });
        if($scope.Detalle.super_administrador){
            $scope.Detalle.rol='Super Administrador';
        }else if($scope.Detalle.contador){
            $scope.Detalle.rol='Contador';
        }else if($scope.Detalle.almacenista){
            $scope.Detalle.rol='Almacenista';
        }else if($scope.Detalle.empleado){
            $scope.Detalle.rol='<E></E>mpleado';
        }
        $('#modalDetalles').modal('open');
    }
    $scope.abrirModal=function(_id){
        swal({
            title: "Confirmar Eliminación",
            text: "¿Esta seguro de borrar el empleado de la base de datos?",
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
        .getResource('personas/'+id,{},'delete')
        .then(function(data){
            $scope.Empleados.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.Empleados.splice(ele.index,1);
                }
            });
            swal("Completado...", data.data.message , "success");
        },function(data){
            swal("Oops...", data.data.message , "error");
        });
    }
    function scroll(){
        $("html, body").animate({
            scrollTop: 0
        }, 1000); 
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
        $scope.panel_title_form = "Edicion de Empleado";
        $scope.button_title_form = "Actualizar Empleado";
        scroll();
    }
    $scope.CancelarEditar=function(){
        $scope.Empleado={};
        $scope.panel_title_form = "Registro de Empleados";
        $scope.button_title_form = "Registrar Empleado";
    }
    /*Validaciones de numeros*/
    $scope.validarNumero=function(id){
        if ($scope.Empleado.telefono<0) {
            $scope.Empleado.telefono=0;
        }
    }
    /*Fin de las validaciones*/
    function listarpersonas(){
        $scope.preloader.estado=true;
        webServer
        .getResource('personas',{empleado:true,contador:true,almacenista:true,super_administrador:true  },'get')
        .then(function(data){
            $scope.Empleados=data.data.datos;
            $scope.gridOptions.data = data.data.datos;
            $scope.preloader.estado=false;
        },function(data){
            $scope.Empleados=[];
            $scope.preloader.estado=false;
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
                    super_administrador : ele.super_administrador,
                    almacenista : ele.almacenista,
                    contador : ele.contador,
                    empleado : ele.empleado,
                    cargo : ele.cargo
                };
            }
        });
        return obj;
    }
})