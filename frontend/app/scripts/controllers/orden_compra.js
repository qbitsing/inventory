'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:OrdenCompraCtrl
 * @description
 * # OrdenCompraCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('OrdenCompraCtrl', function ($state, $scope, $timeout, webServer, Tabla, BotonesTabla, preloader) {
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
    $scope.preloader = preloader;
    $scope.panelAnimate='';
    $scope.pageAnimate='';
    $scope.datosProductos = [];
    $scope.datosMateria = [];
    if ($scope.Usuario.rol=='Contador' || $scope.Usuario.rol=='Almacenista') {
        $state.go('Home');
    }
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
    $scope.Orden.Producto={};
    $scope.Orden.Producto._id='';
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Editarorden+BotonesTabla.Borrarorden+'</div>';
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
        var pro = $scope.productos.find(function(_){
            console.log( $scope.Orden.Producto.codigo)
            return _.codigo == $scope.Orden.Producto.codigo;
        });

        if(pro){
            $scope.Orden.Producto._id = pro._id+','+pro.nombre;
            if (keyEvent.which === 13){
                $('#Cantidad-producto').focus();
            }
            $('#productos .infinite-autocomplete-default-input').val(pro.nombre);
        }else{
            $('#productos .infinite-autocomplete-default-input').val('');  
            $scope.Orden.Producto._id = '';
        }
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
            $('#productos .infinite-autocomplete-default-input').val('');
            $scope.Orden.Producto.cantidad=0;
            $('#codigo_barras').focus();
        }
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
                ele.cantidad += parseInt(obj.cantidad);
                ele.cantidad_faltante += parseInt(obj.cantidad);
                controlador=true;
            }
        });
        if(!controlador){
            $scope.Orden.materia_prima.push(obj);
        }else{
            Materialize.toast('La cantidad se ha sumado al materia prima ya añadida', 4000);
        }
        $scope.Orden.Materia={};
        $('#materias .infinite-autocomplete-default-input').val('');
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
            showLoaderOnConfirm: true,
        },
        function(){
            Borrar(_id);
        });
    }
    function Borrar (id){
        webServer
        .getResource('orden_compra/'+id,{},'delete')
        .then(function(data){
            $scope.Ordenes.forEach(function(ele, index){
                if(ele._id==id){
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
                $scope.Ordenes.unshift($scope.Orden);
            }else{
                $scope.Ordenes[$scope.Orden.index] = $scope.Orden;
                $scope.panel_title_form = "Registro de Compra";
                $scope.button_title_form = "Registrar compra";
            }
            $scope.Orden={};
            $scope.Orden.productos=[];
            $scope.Orden.materia_prima=[];
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
    /*Validaciones de numeros*/
    $scope.validarNumeroMateria=function(){
        if ($scope.Orden.Materia.cantidad<0) {
            $scope.Orden.Materia.cantidad=0;
        }
    }
    $scope.validarNumero=function(){
        if($scope.Orden.Producto.cantidad<0){
            $scope.Orden.Producto.cantidad=0;
        }
    }
    /*Fin de las validaciones*/
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
                    index : index,
                    _id : ele._id,
                    proveedor : ele.proveedor,
                    orden_compra_consecutivo : ele.orden_compra_consecutivo,
                    productos : ele.productos,
                    materia_prima : ele.materia_prima,
                    observaciones : ele.observaciones,
                    fecha : ele.fecha,
                    estado : ele.estado
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
            $scope.preloader.estado = false;
        });
    }
    function listarMaterias(){
        webServer
        .getResource('materiaPrima',{},'get')
        .then(function(data){
            $scope.materias=data.data.datos;
            $scope.materias.forEach(function (_) {
                $scope.datosMateria.push({
                    text: _.nombre,
                    value: _._id + ',' + _.nombre
                });
            });
            listarPersonas();
        },function(data){
            $scope.materias=[];
            listarPersonas();
        });
    }
    function listarProductos(){
        webServer
        .getResource('productos',{producto:true},'get')
        .then(function(data){
            $scope.productos=data.data.datos;
            $scope.productos.forEach(function (_) {
                $scope.datosProductos.push({
                    text: _.nombre + ' ' + _.marca,
                    value: _._id + ',' + _.nombre
                });
            });
            listarMaterias();
        },function(data){
            $scope.productos=[];
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
            listarProductos();
        });
    }
    listarOrdenes();
    $scope.selectAutocompleteProducto = function($element, $data){
        $scope.Orden.Producto={};
        $scope.Orden.Producto._id=$data.value;
    }

    $scope.selectAutocomplete = function($element, $data){
        $scope.Orden.Materia={};
        $scope.Orden.Materia._id=$data.value;
    }
})