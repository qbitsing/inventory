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
    $(document).ready(function(){
        $('.modal').modal();
        $('.modal').modal({
                dismissible: true, // Modal can be dismissed by clicking outside of the modal
                opacity: 0, // Opacity of modal background
                inDuration: 300, // Transition in duration
                outDuration: 200, // Transition out duration
                startingTop: '10%', // Starting top style attribute
                endingTop: '15%', // Ending top style attribute,
                ready: function(modal, trigger) {
                },
                complete: function() {  } // Callback for Modal close
            }
        );
    });
	$timeout(function () {
		$scope.pageAnimate='pageAnimate';
		$scope.panelAnimate='panelAnimate';
	},100);
	$scope.panel_title_form = "Registro de Fabricaciones";
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
    $scope.Remisiones=[];
    $scope.cancelarentrada={};
    $scope.cancelarsalida={
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
    
	var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Editar+BotonesTabla.Salida+BotonesTabla.Entrada+BotonesTabla.MateriaPrima+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
        {
                name:'orden de fabricacion',
                width:'15%',
                cellTemplate: '<div>{{grid.appScope.convertirConsecutivo(row.entity.consecutivo)}}</div>',
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
                width:'45%',
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
        var controler=true;
        $scope.Fabricaciones.forEach(function(ele, index){
            if (ele._id==id) {
                if (ele.estado='Incompleta') {
                    controler=false;
                }
            }
        });
        if(controler){
            webServer
            .getResource('fabricacion/'+id,{},'delete')
            .then(function(data){
                $scope.Fabricaciones.forEach(function(ele, index){
                    if(ele._id==id){
                        $scope.Fabricaciones.splice(ele.index,1);
                    }
                });
                sweetAlert("Completado...", data.data.message , "success");
            },function(data){
                sweetAlert("Oops...", data.data.message , "error");
            });
        }else{
            sweetAlert("Oops...", "La fabricación no se puede eliminar porque ya posee productos dentro del inventario" , "error");
        }   
    }

    $scope.Editar = function(id){
        $scope.panel_title_form = "Edicion de Fabricaciones";
        $scope.button_title_form = "Editar Fabricación";
        $scope.fabricacion = IdentificarFabricacion(id,$scope.Fabricaciones);
        if ($scope.fabricacion.orden_venta) {
            $scope.check='orden';
        }else{
            $scope.check='stock';
        }
    }
    
    $scope.CancelarEditar=function(){
        listarFabricaciones();
        $scope.panel_title_form = "Registro de Fabricaciones";
        $scope.button_title_form = "Registrar fabricación";
        $scope.fabricacion={};
        $scope.check='orden';
        $scope.fabricacion={};
        $scope.fabricacion.productos=[];
        $scope.fabricacion.procesos=[];
        $scope.proceso={};
        $scope.producto={};
        $scope.fabricacion.consecutivo=999;
        $scope.Fabricaciones.forEach(function(ele, index){
            if(ele.consecutivo>=$scope.fabricacion.consecutivo){
                $scope.fabricacion.consecutivo=ele.consecutivo;
            }
        });
        $scope.fabricacion.consecutivo=$scope.fabricacion.consecutivo+1;
    }

    function EnviarFabricacion(){
        var metodo='';
        var ruta='';
        if($scope.button_title_form=='Registrar fabricación'){
            metodo='post';
            ruta='fabricacion';
            $scope.fabricacion.estado='En Fabricacion';
            $scope.fabricacion.estado_remision='Sin Remision';
        }else{
            metodo='put';
            ruta='fabricacion/'+$scope.fabricacion._id;
        }
        if($scope.check!='orden'){
            delete $scope.fabricacion.orden_venta;
        }
        webServer
        .getResource(ruta,$scope.fabricacion,metodo)
        .then(function(data){
            if($scope.button_title_form='Registrar fabricación'){
                $scope.fabricacion._id=data.data.id;
                $scope.Fabricaciones.push($scope.fabricacion);
            }else{
                $scope.Fabricaciones[$scope.fabricacion.index] = $scope.fabricacion;
            }
            $scope.fabricacion={};
            $scope.fabricacion.productos=[];
            $scope.fabricacion.procesos=[];
            $scope.proceso={};
            $scope.producto={};
            $scope.fabricacion.consecutivo=999;
            $scope.Fabricaciones.forEach(function(ele, index){
                if(ele.consecutivo>=$scope.fabricacion.consecutivo){
                    $scope.fabricacion.consecutivo=ele.consecutivo;
                }
            });
            $scope.fabricacion.consecutivo=$scope.fabricacion.consecutivo+1;
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            sweetAlert("Oops...", data.data.message , "error");
        }); 
    }
    $scope.AgregarProducto=function(){
        var controlador=false;
        var obj = {
            _id : $scope.producto._id.split(',')[0],
            nombre : $scope.producto._id.split(',')[1],
            cantidad : $scope.producto.cantidad,
            cantidad_saliente : 0,
            cantidad_fabricada :0,
            cantidad_disponible : $scope.producto.cantidad
        };
        $scope.fabricacion.productos.forEach(function(ele, index){
            if(ele._id==obj._id){
                ele.cantidad=ele.cantidad+$scope.producto.cantidad;
                ele.cantidad_disponible=ele.cantidad_disponible+$scope.producto.cantidad
                controlador=true;
            }
        });
        if(!controlador){
            $scope.fabricacion.productos.push(obj);
        }else{
            Materialize.toast('La cantidad se ha sumado al producto ya añadido', 4000);
        }
        $scope.producto={};
    }
    $scope.AgregarProceso=function(){
        var controler=false;
        var proceso = {
            _id : $scope.proceso._id.split(',')[0],
            nombre : $scope.proceso._id.split(',')[1],
            tipo : $scope.proceso._id.split(',')[2],
            array_responsables : []
        };
        $scope.fabricacion.procesos.forEach(function(ele, index){
            if(ele._id==proceso._id){
                controler=true;
            }
        });
        if(!controler){
            $scope.fabricacion.procesos.push(proceso);
        }else{
            Materialize.toast('El proceso ya esta añadido', 4000);  
        }
        $scope.proceso={};
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
        $scope.cancelarsalida={};
        $scope.modal_salida.productos=[];
        $scope.modal_salida.consecutivo=999;
        $scope.Remisiones.forEach(function(ele, index){
            if(ele.consecutivo>=$scope.modal_salida.consecutivo){
                $scope.modal_salida.consecutivo=ele.consecutivo;
            }
        });
        $scope.modal_salida.consecutivo=$scope.modal_salida.consecutivo+1;
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
                        cantidad : $scope.modal_salida.cantidad,
                        cantidad_faltante : $scope.modal_salida.cantidad
                    }
                    $scope.modal_salida.productos.push(obj);
                    $scope.modal_salida.cantidad='';
                    $scope.modal_salida.producto='';
                }else{
                    Materialize.toast('Error al intentar agregar el producto, la cantidad a sacar es mayor a la cantidad disponible', 4000);
                    res.cantidad_disponible=res.cantidad_disponible+$scope.modal_salida.cantidad;
                    res.cantidad_saliente=res.cantidad_saliente-$scope.modal_salida.cantidad;
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
        $scope.modal_salida.estado='Sin Entrada';
        $scope.modal_salida.fabricacion=$scope.contenido_fabricacion;
        webServer
        .getResource('remision',$scope.modal_salida,'post')
        .then(function(data){
            $scope.Fabricaciones.forEach(function(ele , i){
                if($scope.contenido_fabricacion._id == ele._id){
                    ele.productos=$scope.contenido_fabricacion.productos;
                }
            });
            $scope.Remisiones.push($scope.modal_salida);
            $scope.modal_salida={};
            $scope.modal_salida.consecutivo=999;
            $scope.Remisiones.forEach(function(ele, index){
                if(ele.consecutivo>=$scope.modal_salida.consecutivo){
                    $scope.modal_salida.consecutivo=ele.consecutivo;
                }
            });
            $scope.modal_salida.consecutivo=$scope.modal_salida.consecutivo+1;
            Materialize.toast(data.data.message,4000);
        }
        ,function(data){
            Materialize.toast(data.data.message,4000);
            console.log(data);
        });
    }
    $scope.abrircancelarremision=function(remision){
        $scope.cancelarsalida=remision;
        swal({
            title: "Cancelar remisión",
            text: "Por favor ingrese las observaciones:",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Observaciones"
        },
        function(inputValue){
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("El campo es requerido");
                return false
            }
            $scope.cancelarsalida.observaciones=inputValue;
            $scope.cancelarlaremision();
        });
    }
    $scope.cancelarlaremision=function(){
        var remision=$scope.cancelarsalida;
        if(remision.estado=='Con Entrada'){
            Materialize.toast( "La remisión no se puede cancelar ya que hay productos que ya ingresaron a inventario" , 4000 );
        }else{
            remision.productos.forEach(function(elemento , index){
                $scope.contenido_fabricacion.productos.forEach(function(ele , i){
                    if(elemento.producto._id == ele._id){
                        ele.cantidad_disponible=ele.cantidad_disponible+elemento.cantidad;
                        ele.cantidad_saliente=ele.cantidad_saliente-elemento.cantidad;
                    }
                });
            });
            remision.fabricacion=$scope.contenido_fabricacion;
            webServer
            .getResource('remision'+remision._id,remision,'put')
            .then(function(data){
               $scope.Remisiones.forEach(function(ele , i){
                    if (ele._id == remision._id) {
                        ele.estado = 'Cancelada';
                    }
               });
               $scope.Fabricaciones.forEach(function(ele , i){
                    if($scope.contenido_fabricacion._id == ele._id){
                        ele.productos=$scope.contenido_fabricacion.productos;
                    }
                });
                Materialize.toast(data.data.message,4000);
            }
            ,function(data){
                Materialize.toast(data.data.message,4000);
                console.log(data);
            });
        }
    }

    $scope.AbrirModalEntrada=function(_id){
        $scope.Fabricaciones.forEach(function(ele , i){
            if(_id == ele._id){
                $scope.contenido_fabricacion=ele;
            }
        });
        $scope.modal_entrada={};
        $scope.cancelarentrada={};
        $scope.modal_entrada.productos=[];
        $scope.check_modal_entrada='entrada';
        $('#modalEntradas').modal('open');
        $scope.modal_entrada.consecutivo=999;
        $scope.EntradasFabricaciones.forEach(function(ele, index){
            if(ele.consecutivo>=$scope.modal_entrada.consecutivo){
                $scope.modal_entrada.consecutivo=ele.consecutivo;
            }
        });
        $scope.modal_entrada.consecutivo=$scope.modal_entrada.consecutivo+1;
    }
    $scope.addproductoentrada = function(){
        var res = JSON.parse($scope.modal_entrada.producto);
        res.cantidad_disponible=res.cantidad_disponible-$scope.modal_entrada.cantidad;
        res.cantidad_cantidad_fabricada=res.cantidad_cantidad_fabricada+$scope.modal_entrada.cantidad;
        $scope.contenido_fabricacion.productos.forEach(function(ele , i){
            if(res._id == ele._id){
                if($scope.modal_entrada.cantidad<=ele.cantidad_disponible){
                    ele.cantidad_disponible=ele.cantidad_disponible-$scope.modal_entrada.cantidad;
                    ele.cantidad_fabricada=ele.cantidad_fabricada+$scope.modal_entrada.cantidad;
                    var obj={
                        producto : ele,
                        cantidad : $scope.modal_entrada.cantidad
                    }
                    $scope.modal_entrada.productos.push(obj);
                    $scope.modal_entrada.cantidad='';
                    $scope.modal_entrada.producto='';
                }else{
                    Materialize.toast('Error al intentar agregar el producto, la cantidad a ingresar es mayor a la cantidad disponible', 4000);
                    res.cantidad_disponible=res.cantidad_disponible+$scope.modal_entrada.cantidad;
                    res.cantidad_cantidad_fabricada=res.cantidad_cantidad_fabricada-$scope.modal_entrada.cantidad;
                }
            }
        });     
    }
    $scope.removerproductoentrada = function(producto){
        if($scope.check_modal_entrada=='entrada'){
            $scope.contenido_fabricacion.productos.forEach(function(ele , i){
                if(producto.producto._id == ele._id){
                    ele.cantidad_disponible=ele.cantidad_disponible+producto.cantidad;
                    ele.cantidad_fabricada=ele.cantidad_fabricada-producto.cantidad;
                }
            });
        }
        $scope.modal_entrada.productos.splice(producto.index , 1);
    }
    $scope.cargarRemision=function(){
        var res=JSON.parse($scope.modal_entrada.carga_remision);
        $scope.modal_entrada.remision= res;
        $scope.modal_entrada.productos = res.productos;
        $scope.modal_entrada.productos.forEach(function(ele,index){
            if(ele.cantidad_faltante<1){
                $scope.modal_entrada.productos.splice(index,1);
            }
        });
    }
    $scope.enviarEntrada=function(){
        if($scope.check_modal_entrada=='remision'){
            var controler=true;
            $scope.modal_entrada.productos.forEach(function(ele, index){
                var cantidad_entrante=angular.element('#cantidad'+ele.producto._id).val();
                if(cantidad_entrante>ele.cantidad_faltante){
                    controler=false;
                    Materialize.toast('La cantidad de '+ele.producto.nombre+' a sacar es mayor a la cantidad disponible', 4000);
                }
            });
            if (controler) {
                var contador=0;
                contador1=0;
                $scope.modal_entrada.remision.productos.forEach(function(ele, index){
                    var cantidad=angular.element('#cantidad'+ele.producto._id).val();
                    if (cantidad) {
                        ele.cantidad_faltante=ele.cantidad_faltante-cantidad;
                    }
                    contador1++;
                    if(ele.cantidad_faltante<1){
                        contador++;
                    }
                });
                if(contador==contador1){
                    $scope.modal_entrada.remision.estado='Completada';
                }else{
                    $scope.modal_entrada.remision.estado='Con Entrada';
                }
                $scope.Remisiones.forEach(function(ele, index){
                    if(ele._id>=$scope.modal_entrada.remision._id){
                        ele=$scope.modal_entrada.remision;
                    }
                });
                $scope.modal_entrada.productos.forEach(function(ele, index){
                    ele.cantidad=angular.element('#cantidad'+ele.producto._id).val();
                    delete ele.cantidad_faltante;
                });
                $scope.modal_entrada.productos.forEach(function(elemento, index){
                    $scope.contenido_fabricacion.productos.forEach(function(ele , i){
                        if (ele._id==elemento.producto._id) {
                            ele.cantidad_saliente=ele.cantidad_saliente-elemento.cantidad;
                            ele.cantidad_fabricada=ele.cantidad_fabricada+elemento.cantidad;
                        }
                    });
                });
                var conta=0;
                var conta1=0;
                $scope.contenido_fabricacion.productos.forEach(function(ele , i){
                    conta++;
                    if (ele.cantidad_saliente<1 && ele.cantidad_disponible<1) {
                        conta1++;
                    }
                });
                if (conta1==conta) {
                    $scope.contenido_fabricacion.estado='Completa';
                }else{
                    $scope.contenido_fabricacion.estado='Incompleta';
                }
            }
        }else{
            var contador=0;
            var contador1=0;
            $scope.contenido_fabricacion.productos.forEach(function(ele , i){
                contador++;
                if (ele.cantidad_fabricada==ele.cantidad) {
                    contador1++;
                }
            });
            if (contador1==contador) {
                $scope.contenido_fabricacion.estado='Completa';
            }else{
                $scope.contenido_fabricacion.estado='Incompleta';
            }
        }
        $scope.modal_entrada.fabricacion=$scope.contenido_fabricacion;
        webServer
        .getResource('entrada/remision',$scope.modal_entrada,'post')
        .then(function(data){
            $scope.Fabricaciones.forEach(function(ele , i){
                if($scope.contenido_fabricacion._id == ele._id){
                    ele=$scope.contenido_fabricacion;
                }
            });
            $scope.EntradasFabricaciones.push($scope.modal_entrada);
            $scope.modal_entrada={};
            $scope.modal_entrada.consecutivo=999;
            $scope.EntradasFabricaciones.forEach(function(ele, index){
                if(ele.consecutivo>=$scope.modal_entrada.consecutivo){
                    $scope.modal_entrada.consecutivo=ele.consecutivo;
                }
            });
            Materialize.toast(data.data.message,4000);
        }
        ,function(data){
            Materialize.toast(data.data.message,4000);
            console.log(data);
        });
    }
    $scope.cancelarlaentrada=function(){
        var entrada=$scope.cancelarentrada;
        var controlerfab=true;
        entrada.estado='Cancelada';
        if(entrada.remision){
            var controler=true;
            entrada.productos.forEach(function(elemento , index){
                $scope.contenido_fabricacion.productos.forEach(function(ele , i){
                    if(elemento.producto._id == ele._id){
                        ele.cantidad_afuera=ele.cantidad_afuera+elemento.cantidad;
                        ele.cantidad_fabricada=ele.cantidad_fabricada-elemento.cantidad;
                    }
                    if(ele.cantidad_fabricada>0){
                        controlerfab=false;
                    }
                });
            });
            entrada.productos.forEach(function(elemento , index){
                entrada.remision.productos.forEach(function(ele, i){
                    if(elemento.producto._id == ele.producto._id){
                        ele.cantidad_faltante=ele.cantidad_faltante+elemento.cantidad;
                    }
                    if(ele.cantidad_faltante<ele.cantidad){
                        controler=false;
                    }
                });
            });
            if(controler){
                entrada.remision.estado='Sin Entrada';
            }else{
                entrada.remision.estado='Con Entrada';
            }
        }else{
            entrada.productos.forEach(function(elemento , index){
                $scope.contenido_fabricacion.productos.forEach(function(ele , i){
                    if(elemento.producto._id == ele._id){
                        ele.cantidad_disponible=ele.cantidad_disponible+elemento.cantidad;
                        ele.cantidad_fabricada=ele.cantidad_fabricada-elemento.cantidad;
                    }
                    if(ele.cantidad_fabricada>0){
                        controlerfab=false;
                    }
                });
            });
        }
        if(controlerfab){
            $scope.contenido_fabricacion.estado='En Fabricacion';
        }else{
            $scope.contenido_fabricacion.estado='Incompleta';
        }
        entrada.fabricacion=$scope.contenido_fabricacion;
        webServer
        .getResource('entrada/remision'+entrada._id,entrada,'put')
        .then(function(data){
            if (entrada.remision) {
                $scope.Remisiones.forEach(function(ele, index){
                    if(ele._id==entrada.remision._id){
                        ele=entrada.remision;
                    }
                });
            }
           $scope.EntradasFabricaciones.forEach(function(ele , i){
                if (ele._id == entrada._id) {
                    ele = entrada;
                }
           });
           $scope.Fabricaciones.forEach(function(ele , i){
                if($scope.contenido_fabricacion._id == ele._id){
                    ele=$scope.contenido_fabricacion;
                }
            });
            Materialize.toast(data.data.message,4000);
            $scope.cancelarentrada={};
   
        }
        ,function(data){
            Materialize.toast(data.data.message,4000);
            console.log(data);
            $scope.cancelarentrada={};
   
        });
    }
    $scope.abrircancelarentrada=function(entrada){
        $scope.cancelarentrada=entrada;
        swal({
            title: "Cancelar entrada",
            text: "Por favor ingrese las observaciones:",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Observaciones"
        },
        function(inputValue){
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("El campo es requerido");
                return false
            }
            $scope.cancelarentrada.observaciones=inputValue;
            $scope.cancelarlaentrada();
        });
    }

    $scope.AbrirModalMateriaPrima=function(_id){
        $scope.salida_insumos={};
        $scope.Fabricaciones.forEach(function(ele , i){
            if(_id == ele._id){
                $scope.salida_insumos.fabricacion=ele;
            }
        });
        $scope.salida_insumos.productos=[];
        $scope.salida_insumos.materia_prima=[];
        $('#modalMateriaPrima').modal('open');
    }
    $scope.addmateriainsumo=function(){
        var controlador=false;
        var materia=JSON.parse($scope.salida_materia.Materia);
        var obj={
            materia : materia,
            cantidad : $scope.salida_materia.cantidadMateria
        };
        $scope.salida_insumos.materia_prima.forEach(function(ele, index){
            if(ele._id==materia._id){
                controlador=true;
            }
        });
        $scope.Materias.forEach(function(ele, index){
            if(ele._id==materia._id){
                if(!controlador){
                    if($scope.salida_materia.cantidadMateria<ele.cantidad){
                        $scope.salida_insumos.materia_prima.push(obj);
                    }else{
                        Materialize.toast('Lo sentimos, pero no posee esa cantidad en inventario', 4000);
                    }
                }else{
                    Materialize.toast('La materia prima ya esta añadida', 4000);
                }
            }
        });
        $scope.salida_materia={};
    }
    $scope.addproductoinsumo=function(){
        var controlador=false;
        var producto=JSON.parse($scope.salida_productos.producto);
        var obj={
            producto : producto,
            cantidad : $scope.salida_productos.cantidad
        };
        $scope.salida_insumos.productos.forEach(function(ele, index){
            if(ele._id==producto._id){
                controlador=true;
            }
        });
        $scope.Productos.forEach(function(ele, index){
            if(ele._id==producto._id){
                if(!controlador){
                    if($scope.salida_productos.cantidad<ele.cantidad){
                        $scope.salida_insumos.productos.push(obj);
                    }else{
                        Materialize.toast('Lo sentimos, pero no posee esa cantidad en inventario', 4000);
                    }
                }else{
                    Materialize.toast('El producto ya esta añadido', 4000);
                }
            }
        });
        $scope.salida_productos={};
    }
    $scope.removermateriainsumo=function(index){
        $scope.salida_insumos.materia_prima.splice(index,1);
    }
    $scope.removerproductoinsumo=function(index){
       $scope.salida_insumos.productos.splice(index,1);
    }
    $scope.enviarSalidaInsumos=function(){
        $scope.salida_insumos.productos.forEach(function(ele, ind){
            ele.producto.cantidad=ele.producto.cantidad-ele.cantidad;
        });
        $scope.salida_insumos.materia_prima.forEach(function(ele, ind){
            ele.materia.cantidad=ele.materia.cantidad-ele.cantidad;
        });
        webServer
        .getResource('fabricacion/insumos',$scope.salida_insumos,'post')
        .then(function(data){
            $scope.salida_insumos._id=data.data.id;
            $scope.Productos.forEach(function(elemento, index){
                $scope.salida_insumos.productos.forEach(function(ele, ind){
                    if (elemento._id==ele.producto._id) {
                        elemento=ele.producto;
                    }
                });
            });
            $scope.Materias.forEach(function(elemento, index){
                $scope.salida_insumos.materia_prima.forEach(function(ele, ind){
                    if (elemento._id==ele.materia._id) {
                        elemento=ele.materia;
                    }
                });
            });
            $scope.SalidasInsumos.push($scope.salida_insumos);
            $scope.salida_insumos.productos=[];
            $scope.salida_insumos.materia=[];
            Materialize.toast(data.data.message,4000);
        }
        ,function(data){
            Materialize.toast(data.data.message,4000);
            console.log(data);
        });
    }
    $scope.abrircancelarsalidainsumos=function(salida){
        $scope.cancelarsalidainsumos=salida;
        swal({
            title: "Cancelar la salida de insumos",
            text: "Por favor ingrese las observaciones:",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Observaciones"
        },
        function(inputValue){
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("El campo es requerido");
                return false
            }
            $scope.cancelarsalidainsumos.observaciones=inputValue;
            $scope.cancelarlasalidainsumos();
        });
    }
    $scope.cancelarlasalidainsumos=function(){
        var salida=$scope.cancelarsalidainsumos;
        if(salida.productos){
            salida.productos.forEach(function(ele, ind){
                ele.producto.cantidad=ele.producto.cantidad+ele.cantidad;
            });
        }
        if (salida.materia_prima) {
            salida.materia_prima.forEach(function(ele, ind){
                ele.materia.cantidad=ele.materia.cantidad+ele.cantidad;
            });
        }
        salida.fabricacion=$scope.contenido_fabricacion;
        webServer
        .getResource('fabricacion/insumos'+salida._id,salida,'put')
        .then(function(data){
            $scope.SalidasInsumos.forEach(function(ele , i){
                if (ele._id == salida._id) {
                    ele.estado = 'Cancelada';
                }
            });
            if (salida.productos) {
                $scope.Productos.forEach(function(elemento, index){
                    salida.productos.forEach(function(ele, ind){
                        if (elemento._id==ele.producto._id) {
                            elemento=ele.producto;
                        }
                    });
                });
            }
            if (salida.materia_prima) {
                $scope.Materias.forEach(function(elemento, index){
                    salida.materia_prima.forEach(function(ele, ind){
                        if (elemento._id==ele.materia._id) {
                            elemento=ele.materia;
                        }
                    });
                });
            }
            Materialize.toast(data.data.message,4000);
        }
        ,function(data){
            Materialize.toast(data.data.message,4000);
            console.log(data);
        });
    }
    $scope.convertirFecha = function(fecha){
        var date = new Date(fecha).getDate();
        date += '/'+(new Date(fecha).getMonth()+1);
        date += '/'+new Date(fecha).getFullYear();
        return date;
    }
    $scope.convertirConsecutivo = function(numero){
        var num = '';
        if (numero<10) {
            num='000'+numero;
        }else if(numero <100){
            num='00'+numero;
        }else if(numero <1000){
            num='0'+numero;
        }else if(numero <10000){
            num=''+numero;
        }
        return num;
    }
    function listarFabricaciones(){
        webServer
        .getResource('fabricacion',{},'get')
        .then(function(data){
            $scope.Fabricaciones=data.data.datos;
            $scope.gridOptions.data=$scope.Fabricaciones;
            $scope.fabricacion.consecutivo=999;
            $scope.Fabricaciones.forEach(function(ele, index){
                if(ele.consecutivo>=$scope.fabricacion.consecutivo){
                    $scope.fabricacion.consecutivo=ele.consecutivo;
                }
            });
            $scope.fabricacion.consecutivo=$scope.fabricacion.consecutivo+1;
            listarMaterias();
        },function(data){
            $scope.fabricacion.consecutivo=1;
            $scope.Fabricaciones=[];
            $scope.gridOptions.data=$scope.Fabricaciones;
            console.log(data.data.message);
            listarMaterias();
        });
    }
	function listarOrdenes(){
        webServer
        .getResource('orden_venta',{},'get')
        .then(function(data){
            $scope.Ordenes=data.data.datos;
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
            listarRemisiones();
        },function(data){
            $scope.Productos=[];
            console.log(data.data.message);
            listarRemisiones();
        });
    }
    function listarMaterias(){
        webServer
        .getResource('materiaPrima',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Materias=data.data.datos;
            }else{
                $scope.Materias=[];
            }
            listarSalidasInsumos();
        },function(data){
            $scope.Materias=[];
            console.log(data.data.message);
            listarSalidasInsumos();
        });
    }
    function listarRemisiones(){
        webServer
        .getResource('remision',{},'get')
        .then(function(data){
            $scope.Remisiones=data.data.datos;
            listarEntradasFabricaciones();
        },function(data){
            $scope.Remisiones=[];
            console.log(data.data.message);
            listarEntradasFabricaciones();
        });
    }
    function listarSalidasInsumos(){
        webServer
        .getResource('fabricaciones/insumos',{},'get')
        .then(function(data){
            $scope.SalidasInsumos=data.data.datos;
        },function(data){
            $scope.SalidasInsumos=[];
            console.log(data.data.message);
        });
    }
    function listarEntradasFabricaciones(){
        webServer
        .getResource('entrada/remision',{},'get')
        .then(function(data){
            $scope.EntradasFabricaciones=data.data.datos;
            listarFabricaciones();
        },function(data){
            $scope.EntradasFabricaciones=[];
            console.log(data.data.message);
            listarFabricaciones();
        });
    }
    function listarPersonas(){
        webServer
        .getResource('personas',{empleado:true,proveedorfabricacion:true},'get')
        .then(function(data){
            $scope.personas = data.data.datos;
            listarProductos();
        },function(data){
            $scope.personas = [];
            console.log(data);
            listarProductos();
        });
    }
    listarOrdenes();

    function IdentificarFabricacion (id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    index: index,
                    _id : ele._id,
                    fecha_entrega : new Date (Date.parse(ele.fecha_entrega)),
                    fecha_solicitud : new Date (Date.parse(ele.fecha_solicitud)),
                    productos : ele.productos,
                    procesos : ele.procesos,
                    orden_venta : ele.orden_venta
                };
            }
        });
        return obj;
    }
});