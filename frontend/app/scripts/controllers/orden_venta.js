'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:OrdenVentaCtrl
 * @description
 * # OrdenVentaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('OrdenVentaCtrl', function ($scope,$state, $timeout, webServer, Tabla, BotonesTabla, preloader) {
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
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de venta";
    $scope.button_title_form = "Registrar venta";
    $scope.Orden={};
    $scope.Orden.productos=[];
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Editar+BotonesTabla.Borrar+BotonesTabla.Factura+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'No. de orden',field: 'orden_venta_consecutivo',
                width:'10%',
                minWidth: 100
            },
            {
                name:'cliente',field: 'cliente.nombre',
                width:'30%',
                minWidth: 150
            },
            {
                name:'fecha de solicitud',
                width:'15%',
                cellTemplate: '<div>{{grid.appScope.convertirFecha(row.entity.fecha_recepcion)}}</div>',
                minWidth: 150
            },
            { 
                field: 'estado',
                width:'15%',
                minWidth: 100
            },
            {
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'30%',
                minWidth: 150
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
            $scope.clientes = data.data.datos;
            listarProductos();
        },function(data){
            $scope.clientes = [];
            console.log(data);
            listarProductos();
        });
    }
    function listarProductos(){
        webServer
        .getResource('productos',{producto:true},'get')
        .then(function(data){
            if(data.data){
                $scope.productos=data.data.datos;
            }else{
                $scope.productos=[];
            }
            listarSalidas();
        },function(data){
            $scope.productos=[];
            console.log(data.data.message);
            listarSalidas();
        });
    }
    function listarSalidas(){
        webServer
        .getResource('salidas',{},'get')
        .then(function(data){
            $scope.Salidas=data.data.datos;
            $scope.preloader.estado=false;
        },function(data){
            $scope.Salidas=[];
            console.log(data.data.message);
            $scope.preloader.estado=false;
        });
    }
    function listarOrdenes(){
        $scope.preloader.estado=true;
        webServer
        .getResource('orden_venta',{Salidas:true, Finalizado:true, Activo:true},'get')
        .then(function(data){
            $scope.Ordenes=data.data.datos;
            $scope.gridOptions.data=$scope.Ordenes;
            listarPersonas();
        },function(data){
            $scope.Ordenes=[];
            $scope.gridOptions.data=$scope.Ordenes;
            console.log(data.data.message);
            listarPersonas();
        });
    }
    listarOrdenes();
    $scope.cargarProducto=function(keyEvent){
        var conter=true;
        $scope.productos.forEach(function(ele , index){
            if($scope.Orden.Producto.codigo == ele.codigo){
                $scope.Orden.Producto._id=ele._id+','+ele.nombre+','+ele.precio;
                conter=false;
                if (keyEvent.which === 13){
                    $('#Cantidad').focus();
                }
            }
        });
        if (conter) {
            $scope.Orden.Producto._id='';
        }
    }
    $scope.detectar=function(keyEvent){
        if ($scope.Orden.Producto.cantidad!='') {
            if (keyEvent.which === 13){
                $scope.AgregarProducto();
            }
        }
    }
    $scope.AgregarProducto=function(){
        var controlador=false;
        var obj = {
            _id : $scope.Orden.Producto._id.split(',')[0],
            nombre : $scope.Orden.Producto._id.split(',')[1],
            precio : $scope.Orden.Producto._id.split(',')[2],
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
        }else{
            Materialize.toast('El producto ya esta añadido', 4000);
        }
        $scope.Orden.Producto={};
        $('#codigo_barras').focus();
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
        swal({
            title: "Confirmar Eliminación",
            text: "¿Esta seguro de borrar la orden de venta?",
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
                swal("Cancelado", "La orden de venta no se borrará", "error");
            }
        });
    }
    function Borrar(id){
        var conter=false;
        $scope.Ordenes.forEach(function(ele, index){
            if(ele._id==id){
                if (ele.estado=='Activo') {
                    conter=true;
                }
            }
        });
        if (conter) {
            $scope.preloader.estado = true;
            webServer
            .getResource('orden_venta/'+id,{},'delete')
            .then(function(data){
                $scope.Ordenes.forEach(function(ele, index){
                    if(ele._id==id){
                        $scope.Ordenes.splice(ele.index,1);
                    }
                });
                $scope.preloader.estado = false;
                swal("Completado...", data.data.message , "success");
            },function(data){
                $scope.preloader.estado = false;
                swal("Oops...", data.data.message , "error");
            });
        }else{
            swal("Oops...", "No se puede eliminar la orden porque ya cuenta con salidas" , "error");
        }
    }
    $scope.EnviarOrden=function(){
        $scope.preloader.estado = true;
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
                $scope.Orden._id=data.data.datos._id;
                $scope.Orden.orden_venta_consecutivo=data.data.datos.orden_venta_consecutivo;
                $scope.Ordenes.push($scope.Orden);
            }else{
                $scope.Ordenes[$scope.Orden.index] = $scope.Orden;
                $scope.panel_title_form = "Registro de venta";
                $scope.button_title_form = "Registrar venta";
            }
            $scope.Orden={};
            $scope.Orden.productos=[];
            $scope.preloader.estado = false;
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message , "error");
        });
    }
    function scroll(){
         $("html, body").animate({
            scrollTop: 0
        }, 1000); 
    }
    $scope.Editar = function(id){
        $scope.Orden=IdentificarOrden(id,$scope.Ordenes);
        if ($scope.Orden.estado=="Activo") {
            $scope.panel_title_form = "Edicion de Venta";
            $scope.button_title_form = "Actualizar Venta";
            if(!$scope.Orden.productos){
                $scope.Orden.productos=[];
            }
            scroll();
        }else{
            sweetAlert("Oops..." , "La orden de venta no se puede editar porque ya cuenta con salidas" , "error");
            $scope.Orden={};
            $scope.Orden.productos=[];
            $scope.productos=[];
        }
    }
    $scope.CancelarEditar=function(){
        $scope.Orden={};
        $scope.Orden.productos=[];
        $scope.productos=[];
        $scope.panel_title_form = "Registro de venta";
        $scope.button_title_form = "Registrar venta"; 
    }
    $scope.convertirFecha = function(fecha){
        var date = new Date(fecha).getDate();
        date += '/'+(new Date(fecha).getMonth()+1);
        date += '/'+new Date(fecha).getFullYear();
        return date;
    }
    $scope.Factura = function(param){

        $state.go('Factura',param);
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
                    orden_compra_cliente: ele.orden_compra_cliente,
                    fecha_recepcion : new Date (Date.parse(ele.fecha_recepcion)),
                    fecha_entrega : new Date (Date.parse(ele.fecha_entrega)),
                    lugar_entrega : ele.lugar_entrega,
                    estado : ele.estado
                };
            }
        });
        return obj;
    }
});