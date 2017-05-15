'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:OrdenCompraCtrl
 * @description
 * # OrdenCompraCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('OrdenCompraCtrl', function ($scope, $timeout,webServer, Tabla, BotonesTabla, preloader) {
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
    $scope.panel_title_form = "Registro de Compra";
    $scope.button_title_form = "Registrar compra";
    $scope.Orden={};
    $scope.Orden.productos=[];
    $scope.Orden.materia_prima=[];
    $scope.productos=[];
    $scope.materias=[];
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Editar+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'No. de orden',field: 'orden_compra_consecutivo',
                width:'10%',
                minWidth: 100
            },
            {
                name:'proveedor',field: 'proveedor.nombre',
                width:'30%',
                minWidth: 150
            },
            {
                name:'fecha',
                width:'15%',
                cellTemplate: '<div>{{grid.appScope.convertirFecha(row.entity.fecha)}}</div>',
                minWidth: 150
            },
            { 
                field: 'estado',
                width:'15%',
                minWidth: 150
            },
            {
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'30%',
                minWidth: 150
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);

    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Ordenes.find(function(ele){
            if(ele._id == id){
                return ele;
            }
        });
        if(!$scope.Detalle.materia_prima){
            $scope.Detalle.materia_prima=[];
        }
        if(!$scope.Detalle.productos){
            $scope.Detalle.productos=[];
        }
        $('#modalDetalles').modal('open');
    }
    $scope.cargarProducto=function(keyEvent){
        var conter=true;
        $scope.productos.forEach(function(ele , index){
            if($scope.Orden.Producto.codigo == ele.codigo){
                $scope.Orden.Producto._id=ele._id+','+ele.nombre;
                conter=false;
            }
            if (keyEvent.which === 13){
                $('#Cantidad-producto').focus();
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
        var _id = $scope.Orden.Producto._id.split(',')[0];
        var obj = {};
        $scope.productos.forEach(function(ele , index){
            if(_id == ele._id){
                obj = ele;
            }
        });
        obj.cantidad = $scope.Orden.Producto.cantidad;
        obj.cantidad_faltante = $scope.Orden.Producto.cantidad;
        obj.cantidad_entrante = 0;
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
    $scope.AgregarMateria=function(){
        var controlador=false;
        var obj = {};
        var _id = $scope.Orden.Materia._id.split(',')[0];
        $scope.materias.forEach(function(ele , index){
            if(_id == ele._id){
                obj = ele;
            }
        });
        obj.cantidad = $scope.Orden.Materia.cantidad;
        obj.cantidad_faltante = $scope.Orden.Materia.cantidad;
        obj.cantidad_entrante = 0;
        $scope.Orden.materia_prima.forEach(function(ele, index){
            if(ele._id==obj._id){
                controlador=true;
            }
        });
        if(!controlador){
            $scope.Orden.materia_prima.push(obj);
            $scope.Orden.Materia={};
        }else{
            Materialize.toast('La materia prima ya esta añadida', 4000);
            $scope.Orden.Materia={};
        }
    }
    $scope.BorrarMateria=function(index){
        $scope.Orden.materia_prima.splice(index,1);
    }
    $scope.BorrarProducto=function(index){
        $scope.Orden.productos.splice(index,1);
    }
    $scope.abrirModal=function(_id){
        swal({
            title: "Confirmar Eliminación",
            text: "¿Esta seguro de borrar la orden de compra?",
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
                swal("Cancelado", "La orden de compra no se borrará", "error");
            }
        });
    }
    function Borrar (id){
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
            .getResource('orden_compra/'+id,{},'delete')
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
        if($scope.Orden.productos.length<1){
            $scope.Orden.productos=null;
        }
        if($scope.Orden.materia_prima.length<1){
            $scope.Orden.materia_prima=null;
        }
        var ruta="";
        var metodo="";
        if ($scope.panel_title_form=="Registro de Compra") {
            ruta="orden_compra";
            metodo="post";
        }else{
            ruta="orden_compra/"+$scope.Orden._id;
            metodo="put";
        }
        webServer
        .getResource(ruta,$scope.Orden,metodo)
        .then(function(data){
            $scope.proveedores.forEach(function(ele, index){
                if(ele._id==$scope.Orden.proveedor._id){
                    $scope.Orden.proveedor=ele;
                }
            });
            if($scope.panel_title_form=="Registro de Compra"){
                $scope.Orden.estado='Activo';
                $scope.Orden.fecha=new Date(Date.now());
                $scope.Orden._id=data.data.datos._id;
                $scope.Orden.orden_compra_consecutivo=data.data.datos.orden_compra_consecutivo;
                $scope.Ordenes.push($scope.Orden);
            }else{
                $scope.Ordenes[$scope.Orden.index] = $scope.Orden;
            }
            $scope.Orden={};
            $scope.Orden.productos=[];
            $scope.Orden.materia_prima=[];
            $scope.panel_title_form = "Registro de Compra";
            $scope.button_title_form = "Registrar compra";
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
        if (Orden.estado=='Activo') {
            $scope.panel_title_form = "Edicion de Compra";
            $scope.button_title_form = "Actualizar compra";
            if(!$scope.Orden.productos){
                $scope.Orden.productos=[];
            }
            if(!$scope.Orden.materia_prima){
                $scope.Orden.materia_prima=[];
            }
            scroll();
        }else{
            sweetAlert("Oops...", 'No se puede editar la orden de compra porque ya posee entradas' , "error");
            $scope.Orden={};
            $scope.Orden.productos=[];
            $scope.Orden.materia_prima=[];
            $scope.productos=[];
            $scope.materias=[];
        }
    }
    $scope.CancelarEditar=function(){
        $scope.Orden={};
        $scope.Orden.productos=[];
        $scope.Orden.materia_prima=[];
        $scope.productos=[];
        $scope.materias=[];
        $scope.panel_title_form = "Registro de Compra";
        $scope.button_title_form = "Registrar compra";
    }
    $scope.convertirFecha = function(fecha){
        var date = new Date(fecha).getDate();
        date += '/'+(new Date(fecha).getMonth()+1);
        date += '/'+new Date(fecha).getFullYear();
        return date;
    }
    function IdentificarOrden (id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    index: index,
                    _id : ele._id,
                    proveedor : ele.proveedor,
                    orden_compra_consecutivo : ele.orden_compra_consecutivo,
                    productos : ele.productos,
                    materia_prima : ele.materia_prima,
                    observaciones : ele.observaciones,
                    fecha : ele.fecha
                };
            }
        });
        return obj;
    }
    function listarPersonas(){
        webServer
        .getResource('personas',{proveedorproductos:true},'get')
        .then(function(data){
            $scope.proveedores = data.data.datos;
            listarEntradas();
        },function(data){
            $scope.proveedores = [];
            console.log(data);
            listarEntradas();
        });
    }
    function listarEntradas(){
        webServer
        .getResource('entradas',{},'get')
        .then(function(data){
            $scope.Entradas=data.data.datos;
            $scope.preloader.estado = false;
        },function(data){
            $scope.Entradas=[];
            console.log(data.data.message);
            $scope.preloader.estado = false;
        });
    }
    function listarMaterias(){
        webServer
        .getResource('materiaPrima',{},'get')
        .then(function(data){
            $scope.materias=data.data.datos;
            listarPersonas();
        },function(data){
            $scope.materias=[];
            console.log(data.data.message);
            listarPersonas();
        });
    }
    function listarProductos(){
        webServer
        .getResource('productos',{producto:true},'get')
        .then(function(data){
            $scope.productos=data.data.datos;
            listarMaterias();
        },function(data){
            $scope.productos=[];
            console.log(data.data.message);
            listarMaterias();
        });
    }
    function listarOrdenes(){
        $scope.preloader.estado = true;
        webServer
        .getResource('orden_compra',{Entradas:true, Finalizado:true, Activo:true},'get')
        .then(function(data){
            $scope.Ordenes=data.data.datos;
            $scope.gridOptions.data=$scope.Ordenes;
            listarProductos();
        },function(data){
            $scope.Ordenes=[];
            $scope.gridOptions.data=$scope.Ordenes;
            console.log(data.data.message);
            listarProductos();
        });
    }
    listarOrdenes();
})