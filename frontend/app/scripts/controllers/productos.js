'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ProductosCtrl
 * @description
 * # ProductosCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('ProductosCtrl', function ($scope, $timeout, Tabla, BotonesTabla, webServer) {
    $scope.productBarCode = [];
    $scope.bc = {
        format: 'CODE128',
        lineColor: '#000000',
        width: 2,
        height: 100,
        displayValue: true,
        fontOptions: '',
        font: 'monospace',
        textAlign: 'center',
        textPosition: 'bottom',
        textMargin: 2,
        fontSize: 20,
        background: '#ffffff',
        margin: 0,
        marginTop: undefined,
        marginBottom: undefined,
        marginLeft: undefined,
        marginRight: undefined,
        valid: function (valid) {
        }
    }
    $scope.text = "Hola";
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
	$scope.panel_title_form = "Registro de Productos";
	$scope.button_title_form = "Registrar Producto";
	$scope.Producto={};
    $scope.Producto.Insumos=[];
    $scope.Producto.productos=[];
    $scope.check='producto';
    $scope.Detallemodal={};
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Editar+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                field: 'nombre',
                width:'20%',
                minWidth: 160
            },
            {
                field: 'marca',
                width:'20%',
                minWidth: 160
            },
            {
                name: 'categoria', field: 'categoria.nombre',
                width:'20%',
                minWidth: 160
            },
            {
                field: 'precio',
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
    function listarInsumos(){
        webServer
        .getResource('materiaPrima',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Insumos=data.data.datos;
            }else{
                $scope.Insumos=[];
            }
            listarProductosSelect();
        },function(data){
            $scope.Insumos=[];
            console.log(data.data.message);
            listarProductosSelect();
        });
    }
    function listarProductos(){
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
            console.log(data.data.message);
            listarInsumos();
        });
    }
    function listarProductosSelect(){
        webServer
        .getResource('productos',{producto:true},'get')
        .then(function(data){
            if(data.data){
                $scope.ProductosSelect=data.data.datos;
            }else{
                $scope.ProductosSelect=[];
            }
        },function(data){
            $scope.ProductosSelect=[];
            console.log(data.data.message);
        });
    }
    listarProductos();
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
            console.log('El insumo ya esta añadido');
        }
        $scope.producto={}
    }
    $scope.abrirModal=function(_id){
        $scope.Detallemodal.id=_id;
        $scope.Detallemodal.titulo='Confirmar eliminación';
        $scope.Detallemodal.mensaje='¿Esta seguro que desea eliminar el producto?';
        $('#modalConfirmacion').modal('open');
    }
    $scope.Borrar=function(id){
        $scope.Detallemodal={};
         webServer
        .getResource('productos/'+id,{},'delete')
        .then(function(data){
            $scope.Productos.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.Productos.splice(ele.index,1);
                }
            });
            $scope.ProductosSelect.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.ProductosSelect.splice(ele.index,1);
                }
            });
            $scope.Detallemodal.mensaje='El producto se ha eliminado exitosamente';
        },function(data){
            $scope.Detallemodal.mensaje=data.data.message;
            console.log(data.data.message);
        });
        $scope.Detallemodal.titulo='Notificacion de eliminación';
        $('#modalNotificacion').modal('open');
    }
    $scope.Agregarkit=function(){
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
        }else{
            console.log('El insumo ya esta añadido');
        }
        $scope.Kit={};
    }
    $scope.Borrarkit=function(index){
        $scope.Producto.productos.splice(index,1);
    }
    $scope.EnviarProducto=function(){
        var ruta="";
        var metodo="";
        if($scope.check=='producto'){
            $scope.Producto.productos=null;
        }else{
            $scope.Producto.Insumos=null
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
            $scope.Producto._id=data.data._id;
            $scope.Categorias.forEach(function(ele, index){
                if(ele._id==$scope.Producto.categoria._id){
                    $scope.Producto.categoria=ele;
                }
            });
            if($scope.check=='producto'){
                $scope.Unidades.forEach(function(ele, index){
                    if(ele._id==$scope.Producto.unidad_medida._id){
                        $scope.Producto.unidad_medida=ele;
                    }
                });
                $scope.ProductosSelect.push($scope.Producto);
            }
            if($scope.panel_title_form=="Registro de Productos"){
                $scope.Productos.push($scope.Producto);
                alert('Producto registrado correctamente');
            }else{
                $scope.Productos[$scope.Producto.index] = $scope.Producto;
                alert('Producto actualizada correctamente');
            }
            $scope.Producto={};
            $scope.Producto.Insumos=[];
            $scope.Producto.productos=[];
            $scope.check='producto';
        },function(data){
            console.log(data);
        });
    }
    $scope.Editar = function(id){
        $scope.panel_title_form = "Edicion de Productos";
        $scope.button_title_form = "Editar Producto";
        $scope.Producto = IdentificarProducto(id,$scope.Productos);
        if($scope.Producto.productos){
            $scope.check='kit';
        }else{
            $scope.check='producto';
        }

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
            $scope.productBarCode.push({
                producto: pro,
                cantidad: $scope.productBarCodeCant
            });
        }
        $scope.productBarCodeCant = null;
        $scope.productBarCodeId = null;

    }
    $scope.printBarCodes = function(){

    }
    function IdentificarProducto (id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    index: index,
                    _id : ele._id,
                    nombre : ele.nombre,
                    min_stock : ele.min_stock,
                    cantidad : ele.cantidad,
                    marca : ele.marca,
                    categoria : ele.categoria,
                    unidad_medida : ele.unidad_medida,
                    Insumos : ele.Insumos,
                    productos : ele.productos,
                    precio : ele.precio
                };
            }
        });
        return obj;
    }
});