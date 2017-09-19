'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ProductosCtrl
 * @description
 * # ProductosCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('ProductosCtrl', function ($scope, $timeout, Tabla, BotonesTabla, webServer, preloader) {
    $scope.productBarCode = [];
    $scope.bc = {
        lineColor: '#000000',
        height: 50,
        displayValue: true,
        fontSize: 10
    }
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
	$scope.panel_title_form = "Registro de Productos";
	$scope.button_title_form = "Registrar Producto";
	$scope.Producto={};
    $scope.Producto.unidad_medida={};
    $scope.Producto.categoria={};
    $scope.Producto.Insumos=[];
    $scope.arrayMateria=[];
    $scope.Producto.productos=[];
    $scope.Producto.procesos=[];
    $scope.producto={}
    $scope.producto.Insumo={};
    $scope.Kit={};
    $scope.Kit.producto={};
    $scope.check='producto';
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles;
    if ($scope.Usuario.rol=='Super Administrador') {
        casillaDeBotones+=BotonesTabla.Editar+BotonesTabla.Borrar;
    }
    casillaDeBotones+='</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                field: 'codigo',
                width:'15%',
                minWidth: 160,
                type: 'number',
                enableSorting: true
            },
            {
                field: 'nombre',
                width:'15%',
                minWidth: 160
            },
            {
                field: 'marca',
                width:'15%',
                minWidth: 160
            },
            {
                name: 'categoria', field: 'categoria.nombre',
                width:'15%',
                minWidth: 160
            },
            {
                name:'cantidad',
                width:'20%',
                cellTemplate: '<div>{{row.entity.cantidad}} {{row.entity.unidad_medida.nombre}}</div>',
                minWidth: 250,
                type: 'number',
                enableSorting: true
            },
            {
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'25%',
                minWidth: 230
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);
    
    function listarInsumos(){
        webServer
        .getResource('materiaPrima',{},'get')
        .then(function(data){
            $scope.Insumos=data.data.datos;
            listarProductosSelect();
            $scope.arrayMateria = $scope.Insumos.map(function(ele){
                return {
                    text: ele.nombre,
                    value: ele._id+','+ele.nombre
                }
            });
        },function(data){
            $scope.Insumos=[];
            listarProductosSelect();
        });
    }
    $scope.selectAutocompleteMateria = function(_, $data){
        $scope.producto.Insumo = {};
        $scope.producto.Insumo._id = $data.value;
    }
    function listarProductos(){
        $scope.preloader.estado = true;
        webServer
        .getResource('productos',{producto:true,kit:true},'get')
        .then(function(data){
            if(data.data){
                $scope.Productos=data.data.datos;
                $scope.gridOptions.data=$scope.Productos;
            }else{
                $scope.Productos=[];
                $scope.gridOptions.data=$scope.Productos;
            }
            listarInsumos();
        },function(data){
            $scope.Productos=[];
            $scope.gridOptions.data=$scope.Productos;
            listarInsumos();
        });
    }
    function listarProductosSelect(){
        webServer
        .getResource('productos',{producto:true},'get')
        .then(function(data){
            $scope.ProductosSelect=data.data.datos;
            $scope.preloader.estado = false;
            $scope.arrayProductos = $scope.ProductosSelect.map(function(ele){
                return {
                    text: ele.nombre,
                    value: ele._id+','+ele.nombre
                }
            });
        },function(data){
            $scope.ProductosSelect=[];
            $scope.preloader.estado = false;
        });
    }
    $scope.selectAutocompleteProductos = function(_, $data){
        $scope.Kit = {};
        $scope.Kit.producto={};
        $scope.Kit.producto._id = $data.value;
    }
    listarProductos();
    $scope.cargarProducto=function(keyEvent){
        var ele = $scope.Productos.find(function(ele){
            return ele.codigo == $scope.Kit.codigo
        });
        if(ele){
            $scope.Kit.producto._id=ele._id+','+ele.nombre;
            $('#productosAutocomplete .infinite-autocomplete-default-input').val(ele.nombre);
            if (keyEvent.which === 13){
                $('#Cantidad').focus();
            }
        }else{
            $scope.Kit.producto._id='';
            $('#productosAutocomplete .infinite-autocomplete-default-input').val('');
        }
        
    }
    $scope.detectar=function(keyEvent){
        if ($scope.Kit.producto.cantidad>0) {
            if (keyEvent.which === 13){
                if ($scope.Kit.producto._id!='') {
                    $scope.Agregarkit();
                }
            }
        }
    }
    $scope.AgregarInsumo=function(){
        var controlador=false;
        var obj = {
            _id : $scope.producto.Insumo._id.split(',')[0],
            nombre : $scope.producto.Insumo._id.split(',')[1],
            cantidad : $scope.producto.Insumo.cantidad
        };
        $scope.Producto.Insumos.forEach(function(ele, index){
            if(ele._id==obj._id){
                controlador=true;
            }
        });
        if(!controlador){
            $scope.Producto.Insumos.push(obj);
        }else{
            Materialize.toast('El insumo ya esta añadido', 4000);
        }
        $scope.producto.Insumo._id='';
        $scope.producto.Insumo.cantidad=0;
        $('#insumos .infinite-autocomplete-default-input').val('');
    }
    $scope.AgregarProceso=function(){
        var controlador=false;
        var obj = {
            _id : $scope.proceso._id.split(',')[0],
            nombre : $scope.proceso._id.split(',')[1],
            tipo : $scope.proceso._id.split(',')[2]
        };
        $scope.Producto.procesos.forEach(function(ele, index){
            if(ele._id==obj._id){
                controlador=true;
            }
        });
        if(!controlador){
            $scope.Producto.procesos.push(obj);
        }else{
            Materialize.toast('El proceso ya esta añadido', 4000);
        }
        $scope.proceso={}
    }
    $scope.Borrarproceso=function(index){
        $scope.Producto.procesos.splice(index,1);
    }
    $scope.Borrarproducto=function(index){
        $scope.Producto.Insumos.splice(index,1);
    }
    $scope.abrirModal=function(_id){
        swal({
            title: "Confirmar Eliminación",
            text: "¿Esta seguro de borrar el producto?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, Borrar!",
            cancelButtonText: "No, Cancelar!",
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        },
        function(){
            Borrar(_id);
        });
    }
    function Borrar(id){
        webServer
        .getResource('productos/'+id,{},'delete')
        .then(function(data){
            $scope.Productos.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.Productos.splice(index,1);
                }
            });
            $scope.ProductosSelect.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.ProductosSelect.splice(index,1);
                }
            });
            swal("Completado...", data.data.message , "success");
        },function(data){
            swal("Oops...", data.data.message , "error");
        });
    }
    $scope.Agregarkit=function(){
        if ($scope.Kit.producto._id!='' && $scope.Kit.producto.cantidad>0) {
            var controlador=false;
            var obj = {
                _id : $scope.Kit.producto._id.split(',')[0],
                nombre : $scope.Kit.producto._id.split(',')[1],
                cantidad : $scope.Kit.producto.cantidad
            };
            $scope.Producto.productos.forEach(function(ele, index){
                if(ele._id==obj._id){
                    controlador=true;
                }
            });
            if(!controlador){
                $scope.Producto.productos.push(obj);
                $('#codigo_barras').focus();
            }else{
                Materialize.toast('El producto ya esta añadido', 4000);
            }
            $scope.Kit.producto={};
            $scope.Kit.producto._id='';
            $scope.Kit.producto.cantidad=0;
            $('#productosAutocomplete .infinite-autocomplete-default-input').val('');
            $scope.Kit.codigo = '';     
        }
    }
    $scope.Borrarkit=function(index){
        $scope.Producto.productos.splice(index,1);
    }
    $scope.cambiar=function(){
        $scope.Producto={};
        $scope.Producto.unidad_medida={};
        $scope.Producto.categoria={};
        $scope.Producto.Insumos=[];
        $scope.Producto.productos=[];
        $scope.Producto.procesos=[];
        $scope.producto={};
        $scope.producto.Insumo={};
        $scope.Kit={};
        $scope.Kit.producto={};
        $scope.Kit.producto._id='';
        $scope.Kit.producto.cantidad=0;
    }
    $scope.EnviarProducto=function(){
        $scope.preloader.estado = true;
        var ruta="";
        var metodo="";
        $scope.Categorias.forEach(function(ele,index){
            if ($scope.Producto.categoria._id==ele._id) {
                $scope.Producto.categoria=ele;
            }
        });
        if($scope.check=='kit'){
            $scope.Producto.Insumos=null;
            $scope.Producto.tipo='kit';
        }else{
            $scope.Producto.tipo='producto';
            $scope.Unidades.forEach(function(ele, index){
                if(ele._id==$scope.Producto.unidad_medida._id){
                    $scope.Producto.unidad_medida=ele;
                }
            });
        }
        if ($scope.panel_title_form=="Registro de Productos") {
            ruta="productos";
            metodo="post";
        }else{
            ruta="productos/"+$scope.Producto._id;
            metodo="put";
        }
        webServer
        .getResource(ruta,$scope.Producto,metodo)
        .then(function(data){
            if($scope.panel_title_form=="Registro de Productos"){
                $scope.Producto._id=data.data.datos._id;
                $scope.Producto.producto_consecutivo=data.data.datos.producto_consecutivo;
                if($scope.check=='producto'){
                    $scope.Producto.codigo=data.data.datos.codigo;
                    $scope.ProductosSelect.unshift($scope.Producto);
                }
                $scope.Productos.unshift($scope.Producto);
            }else{
                $scope.Productos[$scope.Producto.index] = $scope.Producto;
                if($scope.check=='producto'){
                    $scope.ProductosSelect.forEach(function(ele, index){
                        if(ele._id==$scope.Producto._id){
                            $scope.ProductosSelect[$scope.Producto.index] = $scope.Producto;
                        }
                    });
                }
                $scope.panel_title_form = "Registro de Productos";
                $scope.button_title_form = "Registrar Producto";
            }
            $scope.Producto={};
            $scope.Producto.Insumos=[];
            $scope.Producto.productos=[];
            $scope.Producto.procesos=[];
            $scope.check='producto';
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
        $scope.panel_title_form = "Edicion de Producto";
        $scope.button_title_form = "Actualizar Producto";
        $scope.Producto = IdentificarProducto(id,$scope.Productos);
        if($scope.Producto.tipo=='kit'){
            $scope.check='kit';
        }else{
            $scope.check='producto';
        }
        scroll();
    }
    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Productos.find(function(ele){
            if(ele._id == id){
                return ele;
            }
        });
        $('#modalDetalles').modal('open');
    }
    $scope.CancelarEditar=function(){
        $scope.Producto={};
        $scope.Producto.unidad_medida={};
        $scope.Producto.categoria={};
        $scope.Producto.Insumos=[];
        $scope.Producto.productos=[];
        $scope.Producto.procesos=[];
        $scope.producto={};
        $scope.producto.Insumo={};
        $scope.Kit={};
        $scope.Kit.producto={};
        $scope.Kit.producto._id='';
        $scope.Kit.producto.cantidad=0;
        $scope.panel_title_form = "Registro de Productos";
        $scope.button_title_form = "Registrar Producto";
    }

    $scope.openModalBarCode = function(){
        $('#modalBarCode').modal('open');
    }
    $scope.addProductBarCode = function(){
        var pro = JSON.parse($scope.productBarCodeId);
        var bandera = true;
        $scope.productBarCode.forEach(function(ele){
            if(ele.producto._id == pro._id) return bandera = false;
        });
        if(bandera){
            pro.barcodes = [];
            for(var i = 0; i < $scope.productBarCodeCant; i++){
                pro.barcodes.push({
                    code : pro.codigo
                });
            }
            $scope.productBarCode.push({
                producto: pro,
                cantidad: $scope.productBarCodeCant
            });
        }
        $scope.productBarCodeCant = null;
        $scope.productBarCodeId = null;
    }
    $scope.printBarCodes = function(){
        var container = document.getElementById('containerBarCodesToPrint');
        var newWindow = window.open();
        newWindow.document.open();
        newWindow.document.appendChild(container);
        newWindow.print();
        newWindow.close();
        document.getElementById('superContainer').appendChild(container);
        $scope.productBarCode = [];
    }
    function IdentificarProducto (id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    index: index,
                    _id : ele._id,
                    nombre : ele.nombre,
                    unidad_medida : ele.unidad_medida,
                    min_stock : ele.min_stock,
                    cantidad : ele.cantidad,
                    marca : ele.marca,
                    categoria : ele.categoria,
                    Insumos : ele.Insumos,
                    procesos : ele.procesos,
                    productos : ele.productos,
                    precio : ele.precio,
                    producto_consecutivo : ele.producto_consecutivo,
                    codigo : ele.codigo,
                    tipo : ele.tipo,
                    fabricado : ele.fabricado,
                    comprado : ele.comprado
                };
            }
        });
        return obj;
    }
})
