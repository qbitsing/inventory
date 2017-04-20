'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:FabricacionCtrl
 * @description
 * # FabricacionCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('FabricacionCtrl', function ($scope, $timeout, Tabla, BotonesTabla, webServer) {
	$scope.panelAnimate='';
	$scope.pageAnimate='';
	$timeout(function () {
		$scope.pageAnimate='pageAnimate';
		$scope.panelAnimate='panelAnimate';
	},100);
	$scope.panel_title_form = "Registro de fabricación";
	$scope.button_title_form = "Registrar fabricación";
	$scope.check='orden';
	$scope.fabricacion={};
    $scope.Detallemodal={};
    $scope.modal={};
	$scope.fabricacion.productos=[];
    $scope.fabricacion.procesos=[];
    $scope.contenido_fabricacion={};
    $scope.modal_salida={};
    $scope.modal_salida.productos=[];
    /*$('.datepicker').pickadate({
        labelMonthNext: 'Next month',
        labelMonthPrev: 'Previous month',
        labelMonthSelect: 'Select a month',
        labelYearSelect: 'Select a year',
        monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
        monthsShort: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
        weekdaysFull: [ 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado' ],
        weekdaysShort: [ 'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab' ],
        weekdaysLetter: [ 'D', 'L', 'M', 'Mi', 'J', 'V', 'S' ],
        today: 'Hoy',
        clear: 'Limpiar',
        close: 'Cerrar'
    });*/
    
	var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Salida+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'orden de fabricacion',field: 'consecutivo',
                width:'20%',
                minWidth: 200
            },
            {
                name:'fecha de solicitud',
                width:'20%',
                cellTemplate: '<div>{{grid.appScope.convertirFecha(row.entity.fecha_solicitud)}}</div>',
                minWidth: 250
            },
            {
                name:'fecha de entrega',
                cellTemplate: '<div>{{grid.appScope.convertirFecha(row.entity.fecha_entrega)}}</div>',
                width:'20%',
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
	$scope.CargarOrden=function(){
        $scope.Ordenes.forEach(function(ele, index){
            if(ele._id==$scope.Orden){
                $scope.fabricacion.orden_venta=ele;
            }
        });
        if(!$scope.fabricacion.orden_venta.productos){
            $scope.fabricacion.orden_venta.productos=[];
        }
        $scope.fabricacion.productos=$scope.fabricacion.orden_venta.productos;
        delete $scope.fabricacion.orden_venta.productos;
    }
    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Fabricaciones.find(function(ele){
            if(ele._id == id){
                return ele;
            }
        });
        $('#modaldeDetalles').modal('open');
    }
    $scope.BorrarProducto=function(index){
        $scope.fabricacion.productos.splice(index,1);
    }
    $scope.abrirModalCrear=function(_id){
        $scope.Detallemodal.titulo='Confirmar Registro';
        $scope.Detallemodal.mensaje='¿Esta seguro que ha suministrado los responsables de los procesos y desea registrar la fabricación?';
        $('#modalConfirmacion').modal('open');
    }
    $scope.Confirmar=function(){
        $('#modalConfirmacion').modal('close');
        if($scope.Detallemodal.titulo=='Confirmar Registro'){
            EnviarFabricacion();
        }else{
            Borrar($scope.Detallemodal.id);
        }
    }

    $scope.abrirModal=function(_id){
        $scope.Detallemodal.id=_id;
        $scope.Detallemodal.titulo='Confirmar eliminación';
        $scope.Detallemodal.mensaje='¿Esta seguro que desea eliminar la fabricación?';
        $('#modalConfirmacion').modal('open');
    }
    function Borrar(id){
        $scope.Detallemodal={};
        webServer
        .getResource('fabricacion/'+id,{},'delete')
        .then(function(data){
            $scope.Fabricaciones.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.Fabricaciones.splice(ele.index,1);
                }
            });
            $scope.Detallemodal.mensaje='La fabricación se ha eliminado exitosamente';
            $scope.Detallemodal.titulo='Notificacion de eliminación';
            $('#modalNotificacion').modal('open');
        },function(data){
            $scope.Detallemodal.mensaje=data.data.message;
            console.log(data.data.message);
            $scope.Detallemodal.titulo='Notificacion de error';
            $('#modalNotificacion').modal('open');
        });
        
    }
    function EnviarFabricacion(){
        if($scope.check!='orden'){
            delete $scope.fabricacion.orden_venta;
        }
        webServer
        .getResource('fabricacion',$scope.fabricacion,'post')
        .then(function(data){
            $scope.personas.forEach(function(ele, index){
                if(ele._id==$scope.fabricacion.responsable._id){
                    $scope.fabricacion.responsable=ele;
                }
            });
            $scope.Fabricaciones.push($scope.fabricacion);
            $scope.fabricacion={};
            $scope.fabricacion.productos=[];
            $scope.fabricacion.consecutivo=0;
            $scope.Fabricaciones.forEach(function(ele, index){
                if(ele.consecutivo>=$scope.fabricacion.consecutivo){
                    $scope.fabricacion.consecutivo=ele.consecutivo;
                }
            });
            $scope.fabricacion.consecutivo=$scope.fabricacion.consecutivo+1;
            $scope.Detallemodal.titulo='Notificacion de registro';
            $scope.Detallemodal.mensaje='La fabricación se ha registrado exitosamente';
            $('#modalNotificacion').modal('open');
        },function(data){
            $scope.Detallemodal.titulo='Notificacion de error';
            $scope.Detallemodal.mensaje=data.data.message;
            console.log(data);
            $('#modalNotificacion').modal('open');
        }); 
    }
    $scope.AgregarProducto=function(){
        var controlador=false;
        var obj = {
            _id : $scope.producto._id.split(',')[0],
            nombre : $scope.producto._id.split(',')[1],
            cantidad : $scope.producto.cantidad,
            cantidad_saliente : 0,
            cantidad_disponible : $scope.producto.cantidad
        };
        $scope.fabricacion.productos.forEach(function(ele, index){
            if(ele._id==obj._id){
                controlador=true;
            }
        });
        if(!controlador){
            $scope.fabricacion.productos.push(obj);
        }else{
            console.log('El insumo ya esta añadido');
        }
        $scope.producto={};
    }
    $scope.AgregarProceso=function(){
        var controler=false;
        var proceso = {
            _id : $scope.proceso._id.split(',')[0],
            nombre : $scope.proceso._id.split(',')[1],
            tipo : $scope.proceso._id.split(',')[2],
            array_responsables : [],
            responsables: ''
        };
        $scope.fabricacion.procesos.forEach(function(ele, index){
            if(ele._id==proceso._id){
                controler=true;
            }
        });
        if(!controler){
            $scope.fabricacion.procesos.push(proceso);
        }else{
            console.log('El proceso ya esta añadido');
        }
    }
    $scope.BorrarProceso=function(index){
        var responsables = $scope.fabricacion.procesos[index].array_responsables;
        $scope.personas = $scope.personas.concat(responsables);
        $scope.fabricacion.procesos.splice(index,1);
    }
    $scope.AbrirModal = function(proceso){
        $scope.modal.proceso=proceso;
        $('#modalResponsables').modal('open');
    }
    $scope.addresponsable = function(){
        var res = JSON.parse($scope.from_modal.persona);
        var index = null;
        $scope.modal.proceso.array_responsables.push(res);
        $scope.personas.forEach(function(ele , i){
            if(res._id == ele._id){
                index = i;
            }
        });
        $scope.personas.splice(index , 1);
    }
    $scope.removeresponsable = function(index){
        var res = $scope.modal.proceso.array_responsables[index];
        $scope.personas.push(res);
        $scope.modal.proceso.array_responsables.splice(index , 1);
    }




    $scope.AbrirModalSalida=function(_id){
        $scope.Fabricaciones.forEach(function(ele , i){
            if(_id == ele._id){
                $scope.contenido_fabricacion=ele;
            }
        });
        $scope.modal_salida={};
        $scope.modal_salida.productos=[];
        $('#modalSalidas').modal('open');
    }
    $scope.addproducto = function(){
        var res = JSON.parse($scope.modal_salida.producto);
        res.cantidad_disponible=res.cantidad_disponible-$scope.modal_salida.cantidad;
        res.cantidad_saliente=res.cantidad_saliente+$scope.modal_salida.cantidad;
        $scope.contenido_fabricacion.productos.forEach(function(ele , i){
            if(res._id == ele._id){
                if($scope.modal_salida.cantidad<=ele.cantidad_disponible){
                    ele.cantidad_disponible=ele.cantidad_disponible-$scope.modal_salida.cantidad;
                    ele.cantidad_saliente=ele.cantidad_saliente+$scope.modal_salida.cantidad;
                    var obj={
                        producto : ele,
                        cantidad : $scope.modal_salida.cantidad
                    }
                    $scope.modal_salida.productos.push(obj);
                    $scope.modal_salida.cantidad='';
                }else{
                    Materialize.toast('Error al intentar agregar el producto, la cantidad a sacar es mayor a la cantidad disponible', 4000);
                }
            }
        });
    }
    $scope.removerproducto = function(producto){
        $scope.contenido_fabricacion.productos.forEach(function(ele , i){
            if(producto.producto._id == ele._id){
                ele.cantidad_disponible=ele.cantidad_disponible+producto.cantidad;
                ele.cantidad_saliente=ele.cantidad_saliente-producto.cantidad;
            }
        });
        $scope.modal_salida.productos.splice(producto.index , 1);
    }
    $scope.cargarProceso=function(){
        $scope.modal_salida.proceso = JSON.parse($scope.modal_salida.carga_proceso);
    }
    $scope.enviarRemision=function(){
        $scope.modal_salida.fabricacion=$scope.contenido_fabricacion;
        webServer
        .getResource('remision',$scope.modal_salida,'post')
        .then(function(data){
            $scope.Fabricaciones.forEach(function(ele , i){
                if($scope.contenido_fabricacion._id == ele._id){
                    ele.productos=$scope.contenido_fabricacion.productos;
                }
            });
            $scope.modal_salida={};
        }
        ,function(data){
            $scope.Detallemodal.titulo='Notificacion de error';
            $scope.Detallemodal.mensaje=data.data.message;
            console.log(data);
        });
    }
    $scope.convertirFecha = function(fecha){
        var date = new Date(fecha).getDate();
        date += '/'+(new Date(fecha).getMonth()+1);
        date += '/'+new Date(fecha).getFullYear();

        return date;
    }






    function listarFabricaciones(){
        webServer
        .getResource('fabricacion',{},'get')
        .then(function(data){
            $scope.Fabricaciones=data.data.datos;
            $scope.gridOptions.data=$scope.Fabricaciones;
            $scope.fabricacion.consecutivo=0;
            $scope.Fabricaciones.forEach(function(ele, index){
                if(ele.consecutivo>=$scope.fabricacion.consecutivo){
                    $scope.fabricacion.consecutivo=ele.consecutivo;
                }
            });
            $scope.fabricacion.consecutivo=$scope.fabricacion.consecutivo+1;
            listarOrdenes();
        },function(data){
            $scope.fabricacion.consecutivo=1;
            $scope.Fabricaciones=[];
            $scope.gridOptions.data=$scope.Fabricaciones;
            console.log(data.data.message);
            listarOrdenes();
        });
    }
	function listarOrdenes(){
        webServer
        .getResource('orden_venta',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Ordenes=data.data.datos;
            }else{
                $scope.Ordenes=[];
            }
            listarPersonas();
        },function(data){
            $scope.Ordenes=[];
            console.log(data.data.message);
            listarPersonas();
        });
    }
    function listarProductos(){
        webServer
        .getResource('productos',{producto:true},'get')
        .then(function(data){
            if(data.data){
                $scope.Productos=data.data.datos;
            }else{
                $scope.Productos=[];
            }
        },function(data){
            $scope.materias=[];
            console.log(data.data.message);
        });
    }
    function listarPersonas(){
        webServer
        .getResource('personas',{empleado:true,proveedor:true},'get')
        .then(function(data){
            if(data.data){
                $scope.personas = data.data.datos;
            }else{
                $scope.personas = [];
            }
            listarProductos();
        },function(data){
            console.log(data);
            listarProductos();
        });
    }
	listarFabricaciones();
});