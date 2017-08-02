'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:OrdenVentaCtrl
 * @description
 * # OrdenVentaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('OrdenVentaCtrl', function ($scope, $state, $timeout, webServer, Tabla, BotonesTabla, preloader) {
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
    $scope.estadoactivoorden='Activo';
    $scope.estadosalidasorden='Con Salidas';
    $scope.estadofinalizadoorden='Finalizado';
    $scope.preloader = preloader;
    $scope.panelAnimate='';
    $scope.pageAnimate='';
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de venta";
    $scope.button_title_form = "Registrar venta";
    $scope.noDisponible=[];
    $scope.Orden={};
    $scope.Orden.productos=[];
    $scope.Orden.Producto={};
    $scope.Orden.Producto._id='';
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles;
    if ($scope.Usuario.rol=='Super Administrador') {
        casillaDeBotones+=BotonesTabla.Editarorden+BotonesTabla.Finalizar;
    }
    if ($scope.Usuario.rol!='Almacenista') {
        casillaDeBotones+=BotonesTabla.Factura;
    }
    casillaDeBotones+='</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'No. de orden',field: 'orden_venta_consecutivo',
                width:'10%',
                minWidth: 100
            },
            {
                name:'cliente',field: 'cliente.nombre',
                width:'15%',
                minWidth: 150
            },
            {
                name:'Orden de cliente',field: 'orden_compra_cliente',
                width:'12%',
                minWidth: 100
            },
            {
                name:'fecha de solicitud',
                width:'15%',
                cellTemplate: '<div>{{grid.appScope.convertirFecha(row.entity.fecha_recepcion)}}</div>',
                minWidth: 150
            },
            { 
                field: 'estado',
                width:'13%',
                minWidth: 100
            },
            {
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'35%',
                minWidth: 420
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
            listarProductos();
        });
    }
    function listarProductos(){
        webServer
        .getResource('productos',{producto:true,kit:true},'get')
        .then(function(data){
            if(data.data){
                $scope.productos=data.data.datos;
            }else{
                $scope.productos=[];
            }
            listarSalidas();
        },function(data){
            $scope.productos=[];
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
            listarPersonas();
        });
    }
    listarOrdenes();
    $scope.cargarProducto=function(keyEvent){
        $scope.productos.forEach(function(ele , index){
            if($scope.Orden.Producto.codigo == ele.codigo){
                $scope.Orden.Producto._id=ele._id+','+ele.nombre+','+ele.precio+','+(ele.fabricado || '')+','+ele.codigo+','+ele.tipo;
                if (keyEvent.which === 13){
                    $('#Cantidad').focus();
                }
            }
        });
    }
    $scope.detectar=function(keyEvent){
        if ($scope.Orden.Producto.cantidad>0) {
            if (keyEvent.which === 13){
                if ($scope.Orden.Producto._id!='') {
                    $scope.AgregarProducto();
                }
            }
        }
    }
    $scope.AgregarProducto=function(){
        if ($scope.Orden.Producto._id!='' && $scope.Orden.Producto.cantidad>0) {
            var controlador=false;
            var obj = {
                _id : $scope.Orden.Producto._id.split(',')[0],
                nombre : $scope.Orden.Producto._id.split(',')[1],
                precio : parseInt($scope.Orden.Producto._id.split(',')[2]),
                fabricado : $scope.Orden.Producto._id.split(',')[3],
                codigo : $scope.Orden.Producto._id.split(',')[4],
                tipo : $scope.Orden.Producto._id.split(',')[5],
                cantidad : $scope.Orden.Producto.cantidad,
                cantidad_faltante : $scope.Orden.Producto.cantidad,
                cantidad_saliente : 0
            };
            $scope.Orden.productos.forEach(function(ele, index){
                if(ele._id==obj._id){
                    ele.cantidad += parseInt(obj.cantidad);
                    ele.cantidad_faltante += parseInt(obj.cantidad);
                    controlador=true;
                }
            });
            if(!controlador){
                $scope.Orden.productos.push(obj);
            }else{
                Materialize.toast('La cantidad se ha sumado al producto ya añadido', 4000);
            }
            $scope.Orden.Producto={};
            $scope.Orden.Producto._id='';
            $scope.Orden.Producto.cantidad=0;
            $('#codigo_barras').focus();
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
        swal({
            title: "Confirmar Eliminación",
            text: "¿Esta seguro de borrar la orden de venta?",
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
    function Borrar(_id){
        webServer
        .getResource('orden_venta/'+_id,{},'delete')
        .then(function(data){
            $scope.Ordenes.forEach(function(ele, index){
                if(ele._id==_id){
                    $scope.Ordenes.splice(index,1);
                }
            });
            swal("Completado...", data.data.message , "success");
        },function(data){
            swal("Oops...", data.data.message , "error");
        });
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
                $scope.Orden.estado='Activo';
                $scope.Ordenes.unshift($scope.Orden);
            }else{
                $scope.Ordenes[$scope.Orden.index] = $scope.Orden;
                $scope.panel_title_form = "Registro de venta";
                $scope.button_title_form = "Registrar venta";
            }
            $scope.Orden={};
            $scope.Orden.productos=[];
            $scope.preloader.estado = false;
            if (data.data.noDisponible.length>0) {
                $scope.noDisponible=data.data.noDisponible;
                var mensaje='<ul>';
                $scope.noDisponible.forEach(function(ele,index){
                    mensaje+='<li>'+ele+'</li>'
                });
                mensaje+='</ul>';
                swal({
                    title: "Atención",
                    text: mensaje,
                    type: "warning",
                    html: true
                });
            }else{
                sweetAlert("Completado...", data.data.message , "success");
            }
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
        if ($scope.Orden.estado == "Activo") {
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
    $scope.Finalizar = function(id){
        swal({
            title: "Confirmar Finalización",
            text: "¿Esta seguro de finalizar la orden de venta?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, Finalizar!",
            cancelButtonText: "No, Cancelar!",
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
        },
        function(){
            webServer
            .getResource('orden_venta/finalizar/'+id,{},'put')
            .then(function(data){
                $scope.Ordenes.forEach(function(ele, index){
                    if(ele._id == id){
                        $scope.Ordenes[index] = data.data.datos;
                    }
                });
                swal("Completado...", data.data.message , "success");
            },function(data){
                swal("Oops...", data.data.message , "error");
            });
        });
    }
    $scope.CancelarEditar=function(){
        $scope.Orden = {};
        $scope.Orden.productos = [];
        $scope.productos = [];
        $scope.panel_title_form = "Registro de venta";
        $scope.button_title_form = "Registrar venta"; 
    }
    /*Validaciones de fechas*/
    $scope.validarFechaEntrega=function(){
        if ($scope.Orden.fecha_entrega) {
            if($scope.Orden.fecha_recepcion){
                if ($scope.Orden.fecha_entrega < $scope.Orden.fecha_recepcion) {
                    Materialize.toast('La fecha de entrega debe ser igual o posterior a la fecha de recepción', 4000);
                    $scope.Orden.fecha_entrega = '';
                }
            }else{
                Materialize.toast('Ingrese por favor una fecha de recepción primero', 4000);
                $scope.Orden.fecha_entrega = '';
                $('#fecha_recepcion').focus();
            }
        }
    }
    $scope.validarFechaRecepcion=function(){
        if ($scope.Orden.fecha_recepcion) {
            if($scope.Orden.fecha_entrega){
                if ($scope.Orden.fecha_entrega < $scope.Orden.fecha_recepcion) {
                    Materialize.toast('La fecha de entrega debe ser igual o posterior a la fecha de recepción', 4000);
                    $scope.Orden.fecha_entrega = '';
                }
            }
        }else{
            $scope.Orden.fecha_entrega='';
        }
    }
    /*Fin de las validaciones*/
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
                    orden_venta_consecutivo : ele.orden_venta_consecutivo,
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
})