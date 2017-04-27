'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:OrdenVentaCtrl
 * @description
 * # OrdenVentaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('OrdenVentaCtrl', function ($scope, $timeout, webServer, Tabla, BotonesTabla) {
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
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de venta";
    $scope.button_title_form = "Registrar venta";
    $scope.Orden={};
    $scope.Detallemodal={};
    $scope.Orden.productos=[];
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Editar+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'Numero de orden interna',field: 'consecutivo',
                width:'20%',
                minWidth: 200
            },
            {
                name:'cliente',field: 'cliente.nombre',
                width:'40%',
                minWidth: 250
            },
            {
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'40%',
                minWidth: 230
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);
    $scope.Orden={};
    $scope.Orden.productos=[];
    $scope.productos=[];
    $scope.materias=[];
    function listarPersonas(){
        webServer
        .getResource('personas',{cliente:true},'get')
        .then(function(data){
            if(data.data){
                $scope.clientes = data.data.datos;
            }else{
                $scope.clientes = [];
            }
            listarProductos();
        },function(data){
            $scope.clientes = [];
            console.log(data);
            listarProductos();
        });
    }
    function listarProductos(){
        webServer
        .getResource('productos',{},'get')
        .then(function(data){
            if(data.data){
                $scope.productos=data.data.datos;
            }else{
                $scope.productos=[];
            }
        },function(data){
            $scope.materias=[];
            console.log(data.data.message);
        });
    }
    function listarOrdenes(){
        webServer
        .getResource('orden_venta',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Ordenes=data.data.datos;
                $scope.gridOptions.data=$scope.Ordenes;
                $scope.Orden.consecutivo=0;
                $scope.Ordenes.forEach(function(ele, index){
                    if(ele.consecutivo>=$scope.Orden.consecutivo){
                        $scope.Orden.consecutivo=ele.consecutivo;
                    }
                });
                $scope.Orden.consecutivo=$scope.Orden.consecutivo+1; 
            }else{
                $scope.Orden.consecutivo='1';
                $scope.Ordenes=[];
                $scope.gridOptions.data=$scope.Ordenes;
            }
            listarPersonas();
        },function(data){
            $scope.Orden.consecutivo='1';
            $scope.Ordenes=[];
            $scope.gridOptions.data=$scope.Ordenes;
            console.log(data.data.message);
            listarPersonas();
        });
    }
    listarOrdenes();
    $scope.AgregarProducto=function(){
        var controlador=false;
        var obj = {
            _id : $scope.Orden.Producto._id.split(',')[0],
            nombre : $scope.Orden.Producto._id.split(',')[1],
            cantidad : $scope.Orden.Producto.cantidad,
            cantidad_faltante : $scope.Orden.Producto.cantidad,
            cantidad_saliente : 0
        };
        $scope.Orden.productos.forEach(function(ele, index){
            if(ele._id==obj._id){
                controlador=true;
            }
        });
        if(!controlador){
            $scope.Orden.productos.push(obj);
            $scope.Orden.Producto={};
        }else{
            Materialize.toast('El producto ya esta añadido', 4000);
            $scope.Orden.Producto={};
        }
    }
    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Ordenes.find(function(ele){
            if(ele._id == id){
                return ele;
            }
        });
        if(!$scope.Detalle.productos){
            $scope.Detalle.productos=[];
        }
        $('#modaldeDetalles').modal('open');
    }
    $scope.BorrarProducto=function(index){
        $scope.Orden.productos.splice(index,1);
    }
    $scope.abrirModal=function(_id){
        $scope.Detallemodal.id=_id;
        $scope.Detallemodal.titulo='Confirmar eliminación';
        $scope.Detallemodal.mensaje='¿Esta seguro que desea eliminar la orden de venta?';
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
            $scope.Detallemodal.mensaje='La orden de venta se ha eliminado exitosamente';
            $scope.Detallemodal.titulo='Notificacion de eliminación';
            $('#modalNotificacion').modal('open');
        },function(data){
            $scope.Detallemodal.mensaje=data.data.message;
            console.log(data.data.message);
            $scope.Detallemodal.titulo='Notificacion de eliminación';
            $('#modalNotificacion').modal('open');
        });
    }
    $scope.EnviarOrden=function(){
        console.log($scope.Orden);
        var ruta="";
        var metodo="";
        if ($scope.panel_title_form=="Registro de venta") {
            ruta="orden_venta";
            metodo="post";
        }else{
            ruta="orden_venta/"+$scope.Orden._id;
            metodo="put";
        }
        webServer
        .getResource(ruta,$scope.Orden,metodo)
        .then(function(data){
            $scope.clientes.forEach(function(ele, index){
                if(ele._id==$scope.Orden.cliente._id){
                    $scope.Orden.cliente=ele;
                }
            });
            if($scope.panel_title_form=="Registro de venta"){
                $scope.Orden._id=data.data.id;
                $scope.Ordenes.push($scope.Orden);
                $scope.Detallemodal.titulo='Notificacion de registro';
                $scope.Detallemodal.mensaje='Orden de compra registrada correctamente';
            }else{
                $scope.Ordenes[$scope.Orden.index] = $scope.Orden;
                $scope.Detallemodal.titulo='Notificacion de actualización';
                $scope.Detallemodal.mensaje='Orden de compra actualizada correctamente';
            }
            $scope.Orden={};
            $scope.Orden.productos=[];
            $scope.Orden.consecutivo=0;
            $scope.Ordenes.forEach(function(ele, index){
                if(ele.consecutivo>=$scope.Orden.consecutivo){
                    $scope.Orden.consecutivo=ele.consecutivo;
                }
            });
            $scope.Orden.consecutivo=$scope.Orden.consecutivo+1;
            $('#modalNotificacion').modal('open');
        },function(data){
            $scope.Detallemodal.titulo='Notificacion de error';
            $scope.Detallemodal.mensaje=data.data.message;
            $('#modalNotificacion').modal('open');
            console.log(data);
        });
        
    }
    $scope.Editar = function(id){
        $scope.panel_title_form = "Edicion de Ventas";
        $scope.button_title_form = "Editar Venta";
        $scope.Orden=IdentificarOrden(id,$scope.Ordenes);
        if(!$scope.Orden.productos){
            $scope.Orden.productos=[];
        }
    }
    $scope.CancelarEditar=function(){
        $scope.Orden={};
        $scope.Orden.productos=[];
        $scope.panel_title_form = "Registro de venta";
        $scope.button_title_form = "Registrar venta";
        $scope.Orden.consecutivo=0;
        $scope.Ordenes.forEach(function(ele, index){
            if(ele.consecutivo>=$scope.Orden.consecutivo){
                $scope.Orden.consecutivo=ele.consecutivo;
            }
        });
        $scope.Orden.consecutivo=$scope.Orden.consecutivo+1; 
    }
    function IdentificarOrden (id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    index: index,
                    _id : ele._id,
                    cliente : ele.cliente,
                    productos : ele.productos,
                    observaciones : ele.observaciones,
                    fecha_recepcion : ele.fecha_recepcion,
                    fecha_entrega : ele.fecha_entrega,
                    lugar_entrega : ele.lugar_entrega
                };
            }
        });
        return obj;
    }
});