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
        });
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
                name:'fecha de solicitud',
                width:'20%',
                cellTemplate: '<div>{{grid.appScope.convertirFecha(row.entity.fecha)}}</div>',
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
        .getResource('personas',{proveedorproductos:true},'get')
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
            listarPersonas();
        },function(data){
            $scope.materias=[];
            console.log(data.data.message);
            listarPersonas();
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
            listarMaterias();
        },function(data){
            $scope.materias=[];
            console.log(data.data.message);
            listarMaterias();
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
                $scope.Orden.consecutivo=999;
                $scope.Ordenes.forEach(function(ele, index){
                    if(ele.consecutivo>=$scope.Orden.consecutivo){
                        $scope.Orden.consecutivo=ele.consecutivo;
                    }
                });
                $scope.Orden.consecutivo=$scope.Orden.consecutivo+1;
            }else{
                $scope.Ordenes=[];
                $scope.gridOptions.data=$scope.Ordenes;
                $scope.Orden.consecutivo=1000;
            }
            listarProductos();
        },function(data){
            $scope.Ordenes=[];
            $scope.gridOptions.data=$scope.Ordenes;
            $scope.Orden.consecutivo=1000;
            console.log(data.data.message);
            listarProductos();
        });
    }
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
            $scope.Orden.Producto={};
        }else{
            Materialize.toast('El producto ya esta añadido', 4000);
            $scope.Orden.Producto={};
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
        webServer
        .getResource('orden_compra/'+id,{},'delete')
        .then(function(data){
            $scope.Ordenes.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.Ordenes.splice(ele.index,1);
                }
            });
            swal("Completado...", data.data.message , "success");
        },function(data){
            swal("Oops...", data.data.message , "error");
        });
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
            sweetAlert("Completado...", data.data.message , "success");
            $scope.proveedores.forEach(function(ele, index){
                if(ele._id==$scope.Orden.proveedor._id){
                    $scope.Orden.proveedor=ele;
                }
            });
            if($scope.panel_title_form=="Registro de Compra"){
                $scope.Orden.fecha=new Date(Date.now());
                $scope.Orden._id=data.data.id;
                $scope.Ordenes.push($scope.Orden);
            }else{
                $scope.Ordenes[$scope.Orden.index] = $scope.Orden;
            }
            $scope.Orden={};
            $scope.Orden.productos=[];
            $scope.Orden.materia_prima=[];
            $scope.Orden.consecutivo=999;
            $scope.Ordenes.forEach(function(ele, index){
                if(ele.consecutivo>=$scope.Orden.consecutivo){
                    $scope.Orden.consecutivo=ele.consecutivo;
                }
            });
            $scope.Orden.consecutivo=$scope.Orden.consecutivo+1;
            $scope.panel_title_form = "Registro de Compra";
            $scope.button_title_form = "Registrar compra";
        },function(data){
            sweetAlert("Oops...", data.data.message , "error");
        });
    }
    function scroll(){
         $("html, body").animate({
            scrollTop: 0
        }, 1000); 
    }
    $scope.Editar = function(id){
        $scope.panel_title_form = "Edicion de Compra";
        $scope.button_title_form = "Actualizar compra";
        $scope.Orden=IdentificarOrden(id,$scope.Ordenes);
        if(!$scope.Orden.productos){
            $scope.Orden.productos=[];
        }
        if(!$scope.Orden.materia_prima){
            $scope.Orden.materia_prima=[];
        }
        scroll();
    }
    $scope.CancelarEditar=function(){
        $scope.Orden={};
        $scope.Orden.productos=[];
        $scope.Orden.materia_prima=[];
        $scope.panel_title_form = "Registro de Compra";
        $scope.button_title_form = "Registrar compra";
        $scope.Orden.consecutivo=999;
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
                    consecutivo : ele.consecutivo,
                    productos : ele.productos,
                    materia_prima : ele.materia_prima,
                    observaciones : ele.observaciones
                };
            }
        });
        return obj;
    }
});
