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
    $scope.panel_title_form = "Registro de Compra";
    $scope.button_title_form = "Registrar compra";
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Editar+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'Numero de orden interna',field: 'consecutivo',
                width:'20%',
                minWidth: 200
            },
            {
                name:'proveedor',field: 'proveedor.nombre',
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
    $scope.Orden.materia_prima=[];
    $scope.productos=[];
    $scope.materias=[];
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
    function listarOrdenes(){
        webServer
        .getResource('orden_compra',{},'get')
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
                $scope.Ordenes=[];
                $scope.gridOptions.data=$scope.Ordenes;
                $scope.Orden.consecutivo='1';
            }
        },function(data){
            $scope.Ordenes=[];
            $scope.gridOptions.data=$scope.Ordenes;
            $scope.Orden.consecutivo='1';
            console.log(data.data.message);
        });
    }
    listarPersonas();
    listarMaterias();
    listarProductos();
    listarOrdenes();
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
            console.log('El insumo ya esta añadido');
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
            $scope.Orden.consecutivo=0;
            $scope.Ordenes.forEach(function(ele, index){
                if(ele.consecutivo>=$scope.Orden.consecutivo){
                    $scope.Orden.consecutivo=ele.consecutivo;
                }
            });
            $scope.Orden.consecutivo=$scope.Orden.consecutivo+1;
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
