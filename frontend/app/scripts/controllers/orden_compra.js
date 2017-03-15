'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:OrdenCompraCtrl
 * @description
 * # OrdenCompraCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('OrdenCompraCtrl', function ($scope, $timeout,webServer, Tabla, BotonesTabla) {
    $scope.panelAnimate='';
    $scope.pageAnimate='';  
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de Compra";
    $scope.button_title_form = "Registrar compra";
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Editar+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'proveedor',field: 'proveedor.nombre',
                width:'50%',
                minWidth: 330
            },
            {
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'50%',
                minWidth: 330
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);
    $scope.Orden={};
    $scope.Orden.productos=[];
    $scope.Orden.materia_prima=[];
    $scope.productos=[];
    $scope.materias=[];
    $scope.Orden.numero_interno='0';
    function listarPersonas(){
        webServer
        .getResource('personas',{proveedor:true},'get')
        .then(function(data){
            if(data.data){
                $scope.proveedores = data.data.datos;
            }else{
                $scope.proveedores = [];
            }
        },function(data){
            console.log(data);
        });
    }
    function listarMaterias(){
        webServer
        .getResource('materiaPrima',{},'get')
        .then(function(data){
            if(data.data){
                $scope.materias=data.data.datos;
            }else{
                $scope.materias=[];
            }
        },function(data){
            $scope.materias=[];
            console.log(data.data.message);
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
        .getResource('orden_compra',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Ordenes=data.data.datos;
                $scope.gridOptions.data=$scope.Ordenes;
            }else{
                $scope.Ordenes=[];
                $scope.gridOptions.data=$scope.Ordenes;
            }
        },function(data){
            $scope.Ordenes=[];
            $scope.gridOptions.data=$scope.Ordenes;
            console.log(data.data.message);
        });
    }
    listarPersonas();
    listarMaterias();
    listarProductos();
    listarOrdenes();
    $scope.AgregarProducto=function(){
        var controlador=false;
        var obj = {
            _id : $scope.Orden.Producto._id.split(',')[0],
            nombre : $scope.Orden.Producto._id.split(',')[1],
            cantidad : $scope.Orden.Producto.cantidad
        };
        $scope.Orden.productos.forEach(function(ele, index){
            if(ele._id==obj._id){
                controlador=true;
            }
        });
        if(!controlador){
            $scope.Orden.productos.push(obj);
        }else{
            console.log('El insumo ya esta añadido');
        }
    }
    $scope.AgregarMateria=function(){
        var controlador=false;
        var obj = {
            _id : $scope.Orden.Materia._id.split(',')[0],
            nombre : $scope.Orden.Materia._id.split(',')[1],
            cantidad : $scope.Orden.Materia.cantidad
        };
        $scope.Orden.materia_prima.forEach(function(ele, index){
            if(ele._id==obj._id){
                controlador=true;
            }
        });
        if(!controlador){
            $scope.Orden.materia_prima.push(obj);
        }else{
            console.log('El insumo ya esta añadido');
        }
    }
    $scope.BorrarMateria=function(index){
        $scope.Orden.materia_prima.splice(index,1);
    }
    $scope.BorrarProducto=function(index){
        $scope.Orden.productos.splice(index,1);
    }
    $scope.EnviarOrden=function(){
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
                $scope.Ordenes.push($scope.Orden);
                alert('Orden de compra registrada correctamente');
            }else{
                $scope.Ordenes[$scope.Orden.index] = $scope.Orden;
                alert('Orden de compra actualizada correctamente');
            }
            $scope.Orden={};
            $scope.Orden.productos=[];
            $scope.Orden.materia_prima=[];
        },function(data){
            console.log(data);
        });
    }
    $scope.Editar = function(id){
        $scope.panel_title_form = "Edicion de Compras";
        $scope.button_title_form = "Editar compra";
        $scope.Orden=IdentificarOrden(id,$scope.Ordenes);
        if(!$scope.Orden.productos){
            $scope.Orden.productos=[];
        }
        if(!$scope.Orden.materia_prima){
            $scope.Orden.materia_prima=[];
        }
    }
    $scope.CancelarEditar=function(){
        $scope.Orden={};
        $scope.Orden.productos=[];
        $scope.Orden.materia_prima=[];
        $scope.panel_title_form = "Registro de Compra";
        $scope.button_title_form = "Registrar compra";
    }
    function IdentificarOrden (id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    index: index,
                    _id : ele._id,
                    proveedor : ele.proveedor,
                    productos : ele.productos,
                    materia_prima : ele.materia_prima,
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