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
        },function(data){
            $scope.Insumos=[];
            console.log(data.data.message);
        });
    }
    function listarProductos(){
        webServer
        .getResource('productos',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Productos=data.data.datos;
                $scope.gridOptions.data=$scope.Productos;
            }else{
                $scope.Productos=[];
                $scope.gridOptions.data=$scope.Productos;
            }
        },function(data){
            $scope.Productos=[];
            $scope.gridOptions.data=$scope.Productos;
            console.log(data.data.message);
        });
    }
    listarProductos();
    listarInsumos();
    $scope.AgregarInsumo=function(){
        var controlador=false;
        var obj = {
            _id : $scope.Producto.Insumo._id.split(',')[0],
            nombre : $scope.Producto.Insumo._id.split(',')[1],
            cantidad : $scope.Producto.Insumo.cantidad
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
    }
    $scope.Borrar=function(index){
        $scope.Producto.Insumos.splice(index,1);
    }
    $scope.EnviarProducto=function(){
        var ruta="";
        var metodo="";
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
            $scope.Categorias.forEach(function(ele, index){
                if(ele._id==$scope.Producto.categoria._id){
                    $scope.Producto.categoria=ele;
                }
            });
            $scope.Unidades.forEach(function(ele, index){
                if(ele._id==$scope.Producto.unidad_medida._id){
                    $scope.Producto.unidad_medida=ele;
                }
            });
            if($scope.panel_title_form=="Registro de Productos"){
                $scope.Productos.push($scope.Producto);
                alert('Producto registrado correctamente');
            }else{
                $scope.Productos[$scope.Producto.index] = $scope.Producto;
                alert('Producto actualizada correctamente');
            }
            $scope.Producto={};
            $scope.Producto.Insumos=[];
        },function(data){
            console.log(data);
        });
    }
    $scope.Editar = function(id){
        $scope.panel_title_form = "Edicion de Productos";
        $scope.button_title_form = "Editar Producto";
        $scope.Producto = IdentificarProducto(id,$scope.Productos);
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
                    Insumos : ele.Insumos,
                    productos : ele.productos,
                    precio : ele.precio
                };
            }
        });
        return obj;
    }
});