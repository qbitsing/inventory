'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:FabricacionCtrl
 * @description
 * # FabricacionCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('FabricacionCtrl', function ($state, $scope, server, $timeout, Tabla, BotonesTabla, webServer, preloader) {
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
        });
    });
	$timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    if ($scope.Usuario.rol=='Contador') {
        $state.go('Home');
    }
    $scope.estadoactivofab='En Fabricacion';
    $scope.preloader = preloader;
    $scope.preloader.estado = true;
    $scope.panel_title_form = "Registro de Fabricaciones";
    $scope.button_title_form = "Registrar fabricación";
    $scope.check='orden';
    $scope.fabricacion={};
    $scope.modal={};
    $scope.modal.proceso={};
    $scope.fabricacion.productos=[];
    $scope.fabricacion.procesos=[];
    $scope.contenido_fabricacion={};
    $scope.modal_salida={};
    $scope.modal_salida.productos=[];
    $scope.Remisiones=[];
    $scope.cancelarentrada={};
    $scope.cancelarsalida={};
    $scope.modal.proceso.array_responsables=[];
    $scope.server = server;
    $scope.contenidoTableProcess = '';
    $scope.fecha_hoy=new Date(Date.now());
    $scope.producto={};
    $scope.producto._id='';
    var casillaDeBotones;
    casillaDeBotones = '<div>'+BotonesTabla.Detalles;
    if ($scope.Usuario.rol == 'Super Administrador') {
        casillaDeBotones += BotonesTabla.Editar;
    }
    casillaDeBotones += BotonesTabla.ImprimirOrdenTrabajo;
    casillaDeBotones += BotonesTabla.Salida+BotonesTabla.Entrada+BotonesTabla.MateriaPrima;
    if ($scope.Usuario.rol == 'Super Administrador') {
        casillaDeBotones += BotonesTabla.Borrarfabricacion;
    }
    casillaDeBotones+='</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'no. orden',field: 'fabricacion_consecutivo',
                width:'10%',
                minWidth: 100
            },
            {
                name:'fecha de solicitud',
                width:'15%',
                cellTemplate: '<div>{{grid.appScope.convertirFecha(row.entity.fecha_solicitud)}}</div>',
                minWidth: 100
            },
            {
                name:'fecha de entrega',
                cellTemplate: '<div>{{grid.appScope.convertirFecha(row.entity.fecha_entrega)}}</div>',
                width:'15%',
                minWidth: 100
            },
            { 
                field: 'estado',
                width:'15%',
                minWidth: 100
            },
            {
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'45%',
                minWidth: 630
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);
    
    /*Validaciones de numeros*/
    $scope.validarNumeroRemision=function(){
        if ($scope.modal_salida.cantidad<0) {
            $scope.modal_salida.cantidad=0;
        }
    }
    $scope.validarNumeroEntrada=function(){
        if ($scope.modal_entrada.cantidad<0) {
            $scope.modal_entrada.cantidad=0;
        }
    }
    $scope.validarNumeroProductoEntrada=function(id){
        if (parseInt(angular.element('#cantidad'+id).val())<1) {
            angular.element('#cantidad'+id).val(1);
        }
    }
    $scope.validarNumeroSalidaMateria=function(){
        if ($scope.salida_insumos.cantidadMateria<0) {
            $scope.salida_insumos.cantidadMateria=0;
        }
    }
    $scope.validarNumeroSalidaProducto=function(){
        if ($scope.salida_productos.cantidad<0) {
            $scope.salida_productos.cantidad=0;
        }
    }
    /*Validaciones de fechas*/
    $scope.validarFechaEntrega=function(){
        if ($scope.modal_salida.fecha_entrega) {
            if($scope.modal_salida.fecha_solicitud){
                if ($scope.modal_salida.fecha_entrega<$scope.modal_salida.fecha_solicitud) {
                    Materialize.toast('La fecha de entrega debe ser igual o posterior a la fecha de solicitud', 4000);
                    $scope.modal_salida.fecha_entrega='';
                }
            }else{
                Materialize.toast('Ingrese por favor una fecha de solicitud primero', 4000);
                $scope.modal_salida.fecha_entrega='';
                $('#fecha_solicitud').focus();
            }
        }
    }
    $scope.validarFechaSolicitud=function(){
        if ($scope.modal_salida.fecha_solicitud) {
            if($scope.modal_salida.fecha_entrega){
                if ($scope.modal_salida.fecha_entrega<$scope.modal_salida.fecha_solicitud) {
                    Materialize.toast('La fecha de entrega debe ser igual o posterior a la fecha de solicitud', 4000);
                    $scope.modal_salida.fecha_entrega='';
                }
            }
        }else{
            $scope.modal_salida.fecha_entrega='';
        }
    }
    $scope.validarFechaHoy=function(){
        if ($scope.fabricacion.fecha_entrega) {
            $scope.fabricacion.fecha_entrega.setHours($scope.fecha_hoy.getHours());
            $scope.fabricacion.fecha_entrega.setMinutes($scope.fecha_hoy.getMinutes());
            $scope.fabricacion.fecha_entrega.setSeconds($scope.fecha_hoy.getSeconds());
            $scope.fabricacion.fecha_entrega.setMilliseconds($scope.fecha_hoy.getMilliseconds());
            if ($scope.fabricacion.fecha_entrega<$scope.fecha_hoy) {
                Materialize.toast('La fecha de entrega debe ser hoy o posterior', 4000);
                $scope.fabricacion.fecha_entrega=$scope.fecha_hoy;
            }
        }
    }
    /*Fin de las validaciones*/

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
        $scope.fabricacion.productos.forEach(function(ele,index){
            if (!ele.fabricado) {
                $scope.fabricacion.productos.splice(index,1);
            }
        });
    }
    $scope.cambiar=function(){
        $scope.fabricacion.procesos.forEach(function (ele){
            ele.array_responsables.forEach(function(e){
                $scope.personas.push(e);
            });
        });
        $scope.fabricacion={};
        $scope.fabricacion.productos=[];
        $scope.fabricacion.procesos=[];
        $scope.proceso={};
        $scope.producto={};
        $scope.producto._id='';
        $scope.producto.cantidad=0;
        $scope.Orden='';
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
    $scope.abrirModalCrear=function(){
        var titulo="";
        var boton="";
        if ($scope.button_title_form=='Registrar fabricación') {
            titulo="Confirmar Registro";
            boton="Si, Registrar!";
        }else{
            titulo="Confirmar Cambios";
            boton="Si, Actualizar!";
        }
        swal({
            title: titulo,
            text: "¿Esta seguro que ha suministrado los responsables de los procesos y desea registrar la fabricación?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: boton,
            cancelButtonText: "No, Cancelar!",
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
        },
        function(){
            EnviarFabricacion();
        });
    }
    $scope.ImprimirTrabajo = function(row){
        $scope.formatoFabricacion = row;
        $scope.calcularContenidoTableProcess();
        var w = window.open();
        var d = w.document.open();
        var ele = document.getElementById('containerFabricacion');
        d.appendChild(ele);

        webServer
        .getResource('fabricacion',{},'get')
        .then(function(data){
            w.print();
            w.close();
            document.getElementById('superContainerFabricacion').appendChild(ele);
        },function(data){
            w.print();
            w.close();
            document.getElementById('superContainerFabricacion').appendChild(ele);
        });

    }
    $scope.abrirModal=function(_id){
        swal({
            title: "Confirmar Eliminación",
            text: "¿Esta seguro de borrar la fabricación?",
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
    function Borrar(id){
        webServer
        .getResource('fabricacion/'+id,{},'delete')
        .then(function(data){
            $scope.Fabricaciones.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.Fabricaciones.splice(ele.index,1);
                }
            });
            swal("Completado...", data.data.message , "success");
        },function(data){
            swal("Oops...", data.data.message , "error");
        });
    }

    $scope.Editar = function(id){
        $scope.panel_title_form = "Edicion de Fabricación";
        $scope.button_title_form = "Actualizar Fabricación";
        $scope.fabricacion = IdentificarFabricacion(id,$scope.Fabricaciones);
        if ($scope.fabricacion.orden_venta) {
            $scope.check='orden';
        }else{
            $scope.check='stock';
        }
        $scope.validarFechaHoy();
    }
    $scope.CancelarEditar=function(){
        $scope.panel_title_form = "Registro de Fabricaciones";
        $scope.button_title_form = "Registrar fabricación";
        $scope.check='orden';
        $scope.fabricacion={};
        $scope.fabricacion.productos=[];
        $scope.fabricacion.procesos=[];
        $scope.proceso={};
        $scope.producto={};
        $scope.producto._id='';
        $scope.producto.cantidad=0;
    }
    $scope.cargarProducto=function(keyEvent){
        $scope.Productos.forEach(function(ele , index){
            if($scope.producto.codigo == ele.codigo){
                $scope.producto._id=ele._id+','+ele.nombre+','+ele.fabricado;
                if (keyEvent.which === 13){
                    $('#Cantidad').focus();
                }
            }
        });
    }
    $scope.detectar=function(keyEvent){
        if ($scope.producto.cantidad>0) {
            if (keyEvent.which === 13){
                if ($scope.producto._id!='') {
                    $scope.AgregarProducto();
                }
            }
        }
    }
    function EnviarFabricacion(){
        $scope.preloader.estado = true;
        var metodo='';
        var ruta='';
        if($scope.button_title_form=='Registrar fabricación'){
            $scope.fabricacion.fecha_solicitud=new Date(Date.now());
            metodo='post';
            ruta='fabricacion';
            $scope.fabricacion.estado='En Fabricacion';
            $scope.fabricacion.estado_remision='Sin Remision';
            $scope.generado=$scope.Usuario;
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
            if($scope.button_title_form=='Registrar fabricación'){
                $scope.fabricacion.fabricacion_consecutivo=data.data.datos.fabricacion_consecutivo;
                $scope.fabricacion._id=data.data.datos._id;
                $scope.Fabricaciones.unshift($scope.fabricacion);
            }else{
                $scope.Fabricaciones[$scope.fabricacion.index] = $scope.fabricacion;
            }
            $scope.fabricacion={};
            $scope.fabricacion.productos=[];
            $scope.fabricacion.procesos=[];
            $scope.proceso={};
            $scope.producto={};
            $scope.producto._id='';
            $scope.producto.cantidad=0;
            $scope.modal={};
            $scope.modal.proceso={};    
            $scope.modal.proceso.array_responsables=[];
            $scope.panel_title_form = "Registro de Fabricacion";
            $scope.button_title_form = "Registrar fabricación";
            $scope.preloader.estado = false;
            swal("Completado...", data.data.message , "success");
        },function(data){
            $scope.preloader.estado = false;
            swal("Oops...", data.data.message , "error");
        }); 
    }
    $scope.AgregarProducto=function(){
        if ($scope.producto._id!='' && $scope.producto.cantidad>0) {
            var controlador=false;
            var obj = {
                _id : $scope.producto._id.split(',')[0],
                nombre : $scope.producto._id.split(',')[1],
                fabricado : $scope.producto._id.split(',')[2],
                cantidad : $scope.producto.cantidad,
                cantidad_saliente : 0,
                cantidad_fabricada :0,
                cantidad_disponible : $scope.producto.cantidad
            };
            $scope.fabricacion.productos.forEach(function(ele, index){
                if(ele._id==obj._id){
                    ele.cantidad+=parseInt($scope.producto.cantidad);
                    ele.cantidad_disponible+=parseInt($scope.producto.cantidad);
                    controlador=true;
                }
            });
            if(!controlador){
                $scope.fabricacion.productos.push(obj);
            }else{
                Materialize.toast('La cantidad se ha sumado al producto ya añadido', 4000);
            }
            $scope.producto={};
            $scope.producto._id='';
            $scope.producto.cantidad=0;
            $('#codigo_barras').focus();
        }
    }
    $scope.AgregarProceso=function(){
        var controler=false;
        var proceso = {
            _id : $scope.proceso._id.split(',')[0],
            proceso_consecutivo : $scope.proceso._id.split(',')[1],
            nombre : $scope.proceso._id.split(',')[2],
            tipo : $scope.proceso._id.split(',')[3],
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
        var contadorresponsables=false;
        if ($scope.modal.proceso.tipo=='Interno') {
            contadorresponsables=true;
        }else{
            if ($scope.modal.proceso.array_responsables.length<1) {
                contadorresponsables=true;
            }else{
                Materialize.toast('No se puede añadir mas de un responsable al proceso', 4000);
            }
        }
        if (contadorresponsables) {
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
        $('#modalSalidas').modal('open');
    }
    $scope.CerrarModalSalidas=function(){
        $scope.contenido_fabricacion.productos.forEach(function(ele , i){
            $scope.modal_salida.productos.forEach(function(elemento , index){   
                if(ele._id==elemento.producto._id) {
                    ele.cantidad_disponible+=parseInt(elemento.cantidad);
                    ele.cantidad_saliente-=elemento.cantidad;
                }
            });
        });
        $scope.modal_salida={};
        $scope.cancelarsalida={};
        $scope.modal_salida.productos=[];
    }
    $scope.addproducto = function(){
        var res = JSON.parse($scope.modal_salida.producto);
        $scope.contenido_fabricacion.productos.forEach(function(ele , i){
            if(res._id == ele._id){
                if($scope.modal_salida.cantidad<=ele.cantidad_disponible){
                    ele.cantidad_disponible -= $scope.modal_salida.cantidad;
                    ele.cantidad_saliente += parseInt($scope.modal_salida.cantidad);
                    var obj={
                        producto : ele,
                        cantidad : $scope.modal_salida.cantidad,
                        cantidad_faltante : $scope.modal_salida.cantidad
                    }
                    var contro=true;
                    $scope.modal_salida.productos.forEach(function(elemento , index){
                        if(res._id==elemento._id) {
                            ele.cantidad += parseInt(obj.cantidad);
                            ele.cantidad_faltante += parseInt(obj.cantidad);
                            contro=false;
                        }
                    });
                    if (contro) {
                        $scope.modal_salida.productos.push(obj);
                    }else{
                        Materialize.toast('La cantidad se ha sumado al producto ya añadido', 4000);
                    }
                    $scope.modal_salida.cantidad='';
                    $scope.modal_salida.producto='';
                }else{
                    Materialize.toast('Error al intentar agregar el producto, la cantidad a sacar es mayor a la cantidad disponible', 4000);
                }
            }
        });
    }
    $scope.removerproducto = function(producto){
        $scope.contenido_fabricacion.productos.forEach(function(ele , i){
            if(producto.producto._id == ele._id){
                ele.cantidad_disponible=parseInt(ele.cantidad_disponible) + parseInt(producto.cantidad);
                ele.cantidad_saliente=ele.cantidad_saliente-producto.cantidad;
            }
        });
        $scope.modal_salida.productos.splice(producto.index , 1);
    }
    $scope.cargarProceso=function(){
        $scope.modal_salida.proceso = JSON.parse($scope.modal_salida.carga_proceso);
    }
    $scope.enviarRemision=function(){
        $scope.preloader.estado = true;
        $scope.modal_salida.estado='Sin Entrada';
        $scope.modal_salida.fabricacion=$scope.contenido_fabricacion;
        $scope.modal_salida.generado=$scope.Usuario;
        webServer
        .getResource('remision',$scope.modal_salida,'post')
        .then(function(data){
            $scope.Fabricaciones.forEach(function(ele , i){
                if($scope.contenido_fabricacion._id == ele._id){
                    ele.productos=$scope.contenido_fabricacion.productos;
                }
            });
            $scope.modal_salida._id=data.data.datos._id;
            $scope.modal_salida.remision_consecutivo=data.data.datos.remision_consecutivo;
            $scope.Remisiones.unshift($scope.modal_salida);
            $scope.modal_salida={};
            $scope.modal_salida.productos=[];
            $scope.preloader.estado = false;
            sweetAlert("Completado...", data.data.message , "success");
        }
        ,function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message , "error");
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
            showLoaderOnConfirm: true,
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
            $scope.preloader.estado = true;
            remision.productos.forEach(function(elemento , index){
                $scope.contenido_fabricacion.productos.forEach(function(ele , i){
                    if(elemento.producto._id == ele._id){
                        ele.cantidad_disponible += parseInt(elemento.cantidad);
                        ele.cantidad_saliente -= elemento.cantidad;
                    }
                });
            });
            remision.fabricacion=$scope.contenido_fabricacion;
            webServer
            .getResource('remision/'+remision._id,remision,'put')
            .then(function(data){
                $scope.Remisiones.forEach(function(ele , i){
                    if (ele._id == remision._id) {
                        ele.estado = 'Cancelada';
                        ele.observaciones=remision.observaciones;
                    }
                });
                $scope.Fabricaciones.forEach(function(ele , i){
                    if($scope.contenido_fabricacion._id == ele._id){
                        ele.productos=$scope.contenido_fabricacion.productos;
                    }
                });
                $scope.preloader.estado = false;
                swal("Completado...", data.data.message , "success");
            }
            ,function(data){
                $scope.preloader.estado = false;
                swal("Oops...", data.data.message , "error");
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
    }
    $scope.CerrarModalEntradas=function(){
        $scope.contenido_fabricacion.productos.forEach(function(ele , i){
            $scope.modal_entrada.productos.forEach(function(elemento , index){
                if(ele._id==elemento.producto._id) {
                    if ($scope.check_modal_entrada!='remision') {
                        ele.cantidad_disponible += parseInt(elemento.cantidad);
                        ele.cantidad_fabricada -= elemento.cantidad;
                    }
                }
            });
        });
        $scope.modal_entrada={};
        $scope.cancelarentrada={};
        $scope.modal_entrada.productos=[];
    }
    $scope.addproductoentrada = function(){
        var res = JSON.parse($scope.modal_entrada.producto);
        $scope.contenido_fabricacion.productos.forEach(function(ele , i){
            if(res._id == ele._id){
                if($scope.modal_entrada.cantidad<=ele.cantidad_disponible){
                    ele.cantidad_disponible -= $scope.modal_entrada.cantidad;
                    ele.cantidad_fabricada += parseInt($scope.modal_entrada.cantidad);
                    var obj={
                        producto : ele,
                        cantidad : $scope.modal_entrada.cantidad
                    }
                    var contro=true;
                    $scope.modal_entrada.productos.forEach(function(elemento , index){
                        if(res._id==elemento._id) {
                            ele.cantidad += parseInt(obj.cantidad);
                            contro=false;
                        }
                    });
                    if (contro) {
                        $scope.modal_entrada.productos.push(obj);
                    }else{
                        Materialize.toast('La cantidad se ha sumado al producto ya añadido', 4000);
                    }
                    $scope.modal_entrada.cantidad='';
                    $scope.modal_entrada.producto='';
                }else{
                    Materialize.toast('Error al intentar agregar el producto, la cantidad a ingresar es mayor a la cantidad disponible', 4000);
                }
            }
        });     
    }
    $scope.removerproductoentrada = function(producto){
        if($scope.check_modal_entrada=='entrada'){
            $scope.contenido_fabricacion.productos.forEach(function(ele , i){
                if(producto.producto._id == ele._id){
                    ele.cantidad_disponible += parseInt(producto.cantidad);
                    ele.cantidad_fabricada -= producto.cantidad;
                }
            });
        }
        $scope.modal_entrada.productos.splice(producto.index , 1);
    }
    $scope.cargarRemision=function(){
        var res=JSON.parse($scope.modal_entrada.carga_remision);
        $scope.modal_entrada.remision = res;
        $scope.modal_entrada.productos = res.productos;
    }
    $scope.enviarEntrada=function(){
        var controlador_enviar=true;
        if($scope.check_modal_entrada=='remision'){
            var controler=true;
            $scope.modal_entrada.productos.forEach(function(ele, index){
                var cantidad_entrante=angular.element('#cantidad'+ele.producto._id).val();
                if(cantidad_entrante>ele.cantidad_faltante){
                    controler=false;
                    controlador_enviar=false;
                    Materialize.toast('La cantidad de '+ele.producto.nombre+' a sacar es mayor a la cantidad disponible', 4000);
                }
            });
            if (controler) {
                var contador=0;
                contador1=0;
                $scope.modal_entrada.remision.productos.forEach(function(ele, index){
                    var cantidad=angular.element('#cantidad'+ele.producto._id).val();
                    if (cantidad) {
                        ele.cantidad_faltante-=cantidad;
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
                    if(ele._id==$scope.modal_entrada.remision._id){
                        $scope.Remisiones[index]=$scope.modal_entrada.remision;
                    }
                });
                $scope.modal_entrada.productos.forEach(function(elemento, index){
                    delete elemento.cantidad_entrante;
                    elemento.cantidad=angular.element('#cantidad'+elemento.producto._id).val();
                    $scope.contenido_fabricacion.productos.forEach(function(ele , i){
                        if (ele._id==elemento.producto._id) {
                            ele.cantidad_saliente -= elemento.cantidad;
                            ele.cantidad_fabricada += parseInt(elemento.cantidad);
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
        if (controlador_enviar) {
            $scope.preloader.estado = true;
            $scope.modal_entrada.fabricacion=$scope.contenido_fabricacion;
            webServer
            .getResource('entrada/remision',$scope.modal_entrada,'post')
            .then(function(data){
                $scope.Fabricaciones.forEach(function(ele , i){
                    if($scope.contenido_fabricacion._id == ele._id){
                        ele=$scope.contenido_fabricacion;
                    }
                });
                $scope.modal_entrada._id=data.data.datos._id;
                $scope.modal_entrada.entrada_remision_consecutivo=data.data.datos.entrada_remision_consecutivo;
                $scope.EntradasFabricaciones.unshift($scope.modal_entrada);
                $scope.modal_entrada={};
                $scope.modal_entrada.productos=[];
                $scope.preloader.estado = false;
                sweetAlert("Completado...", data.data.message , "success");
            }
            ,function(data){
                $scope.preloader.estado = false;
                sweetAlert("Oops...", data.data.message , "error");
            });
        }
    }
    $scope.cancelarlaentrada=function(){
        $scope.preloader.estado = true;
        var entrada=$scope.cancelarentrada;
        var controlerfab=true;
        entrada.estado='Cancelada';
        if(entrada.remision){
            var controler=true;
            entrada.productos.forEach(function(elemento , index){
                $scope.contenido_fabricacion.productos.forEach(function(ele , i){
                    if(elemento.producto._id == ele._id){
                        ele.cantidad_saliente += parseInt(elemento.cantidad);
                        ele.cantidad_fabricada -= elemento.cantidad;
                    }
                    if(ele.cantidad_fabricada>0){
                        controlerfab=false;
                    }
                });
            });
            entrada.productos.forEach(function(elemento , index){
                entrada.remision.productos.forEach(function(ele, i){
                    if(elemento.producto._id == ele.producto._id){
                        ele.cantidad_faltante += parseInt(elemento.cantidad);
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
                        ele.cantidad_disponible += parseInt(elemento.cantidad);
                        ele.cantidad_fabricada -= elemento.cantidad;
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
        .getResource('entrada/remision/'+entrada._id,entrada,'put')
        .then(function(data){
            if (entrada.remision) {
                $scope.Remisiones.forEach(function(ele, index){
                    if(ele._id == entrada.remision._id){
                        $scope.Remisiones[index]=entrada.remision;
                    }
                });
            }
            $scope.EntradasFabricaciones.forEach(function(ele , i){
                if (ele._id == entrada._id) {
                    $scope.EntradasFabricaciones[i]=entrada;
                }
            });
            $scope.Fabricaciones.forEach(function(ele , i){
                if($scope.contenido_fabricacion._id == ele._id){
                    $scope.Fabricaciones[i]=$scope.contenido_fabricacion;
                }
            });
            $scope.preloader.estado = false;
            swal("Completado...", data.data.message , "success");
            $scope.cancelarentrada={};
        }
        ,function(data){
            $scope.preloader.estado = false;
            swal("Oops...", data.data.message , "error");
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
            inputPlaceholder: "Observaciones",
            showLoaderOnConfirm: true
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
        var cantidadM=0;
        var obj={
            materia : materia,
            cantidad : $scope.salida_materia.cantidadMateria
        };
        $scope.salida_insumos.materia_prima.forEach(function(ele, index){
            if(ele._id == materia._id){
                ele.cantidad += obj.cantidad;
                cantidadM = ele.cantidad;
                controlador = true;
            }
        });
        $scope.Materias.forEach(function(ele, index){
            if(ele._id==materia._id){
                if(!controlador){
                    if(obj.cantidad <= ele.cantidad){
                        $scope.salida_insumos.materia_prima.push(obj);
                    }else{
                        Materialize.toast('Lo sentimos, pero no posee esa cantidad en inventario', 4000);
                    }
                }else{
                    if(cantidadM > ele.cantidad){
                        $scope.salida_insumos.materia_prima.forEach(function(ele, index){
                            if(ele._id == materia._id){
                                ele.cantidad -= obj.cantidad;
                            }
                        });
                    }else{
                        Materialize.toast('No se puede sumar esa cantidad a la materia prima ya que no posee esa cantidad en inventario', 4000);
                    }
                }
            }
        });
        $scope.salida_materia={};
    }
    $scope.addproductoinsumo=function(){
        var controlador=false;
        var producto=JSON.parse($scope.salida_productos.producto);
        var cantidadP=0;
        var obj={
            producto : producto,
            cantidad : $scope.salida_productos.cantidad
        };
        $scope.salida_insumos.productos.forEach(function(ele, index){
            if(ele._id==producto._id){
                ele.cantidad += obj.cantidad;
                cantidadP = ele.cantidad;
                controlador=true;
            }
        });
        $scope.Productos.forEach(function(ele, index){
            if(ele._id==producto._id){
                if(!controlador){
                    if(obj.cantidad <= ele.cantidad){
                        $scope.salida_insumos.productos.push(obj);
                    }else{
                        Materialize.toast('Lo sentimos, pero no posee esa cantidad en inventario', 4000);
                    }
                }else{
                    if(cantidadP > ele.cantidad){
                        $scope.salida_insumos.productos.forEach(function(ele, index){
                            if(ele._id == producto._id){
                                ele.cantidad -= obj.cantidad;
                            }
                        });
                    }else{
                        Materialize.toast('No se puede sumar esa cantidad al producto ya que no posee esa cantidad en inventario', 4000);
                    }
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
        $scope.preloader.estado = true;
        $scope.salida_insumos.productos.forEach(function(ele, ind){
            ele.producto.cantidad -= ele.cantidad;
        });
        $scope.salida_insumos.materia_prima.forEach(function(ele, ind){
            ele.materia.cantidad -= ele.cantidad;
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
            $scope.SalidasInsumos.unshift($scope.salida_insumos);
            $scope.salida_insumos.productos=[];
            $scope.salida_insumos.materia=[];
            $scope.preloader.estado = false;
            sweetAlert("Completado...", data.data.message , "success");
        }
        ,function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message , "error");
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
            inputPlaceholder: "Observaciones",
            showLoaderOnConfirm: true
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
        $scope.preloader.estado = true;
        var salida=$scope.cancelarsalidainsumos;
        if(salida.productos){
            salida.productos.forEach(function(ele, ind){
                ele.producto.cantidad -= ele.cantidad;
            });
        }
        if (salida.materia_prima) {
            salida.materia_prima.forEach(function(ele, ind){
                ele.materia.cantidad -= ele.cantidad;
            });
        }
        salida.fabricacion=$scope.salida_insumos.fabricacion;
        webServer
        .getResource('fabricacion/insumos/'+salida._id,salida,'put')
        .then(function(data){
            $scope.SalidasInsumos.forEach(function(ele , i){
                if (ele._id == salida._id) {
                    ele.estado = 'Cancelada';
                    ele.observaciones=salida.observaciones;
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
            $scope.preloader.estado = false;
            swal("Completado...", data.data.message , "success");
        }
        ,function(data){
            $scope.preloader.estado = false;
            swal("Oops...", data.data.message , "error");
        });
    }
    $scope.convertirFecha = function(fecha){
        var date = new Date(fecha).getDate();
        date += '/'+(new Date(fecha).getMonth()+1);
        date += '/'+new Date(fecha).getFullYear();
        return date;
    }
    $scope.imprimirRemision = function(formato){
        $scope.formato = formato;
        var formatoPrint = document.getElementById('container');
        var w = window.open();
        var d = w.document.open();
        d.appendChild(formatoPrint);

        webServer
        .getResource('fabricacion',{},'get')
        .then(function(data){
            w.print();
            w.close();
            document.getElementById('superContainer').appendChild(formatoPrint);
        },function(data){
            w.print();
            w.close();
            document.getElementById('superContainer').appendChild(formatoPrint);
        });
    }
    function listarFabricaciones(){
        $scope.preloader.estado = true;
        webServer
        .getResource('fabricacion',{},'get')
        .then(function(data){
            $scope.Fabricaciones=data.data.datos;
            $scope.gridOptions.data=$scope.Fabricaciones;
            listarMaterias();
        },function(data){
            $scope.Fabricaciones=[];
            $scope.gridOptions.data=$scope.Fabricaciones;
            listarMaterias();
        });
    }

    $scope.calcularContenidoTableProcess = function(){
        var cade = '';
        for(var i = 0; i < $scope.formatoFabricacion.procesos.length; i++){
            cade += '<tr><td rowspan="'+$scope.formatoFabricacion.procesos[i].array_responsables.length+'">';
            cade += $scope.formatoFabricacion.procesos[i].proceso_consecutivo || '' + ' - ';
            cade += $scope.formatoFabricacion.procesos[i].nombre;
            cade += '</td><td class="sinBordesTopBottom">';
            if($scope.formatoFabricacion.procesos[i].array_responsables[0]){
                cade += $scope.formatoFabricacion.procesos[i].array_responsables[0].nombre || '';
                cade += $scope.formatoFabricacion.procesos[i].array_responsables[0].apellidos || '';
            }
            cade += '</td></tr>';
            for(var x = 1; x < $scope.formatoFabricacion.procesos[i].array_responsables.length; x++){
                cade += '<tr><td class="sinBordesTopBottom">';
                cade += $scope.formatoFabricacion.procesos[i].array_responsables[x].nombre+ ' ';
                cade += $scope.formatoFabricacion.procesos[i].array_responsables[x].apellidos|| '' + ' ';
                cade += '</td></tr>';
            }
        }

        cade += '<tr><td> Autoriza: '+ $scope.formatoFabricacion.generado.nombre+' '+$scope.formatoFabricacion.generado.apellidos || '' +'</td></tr>';

        $('#contenidoTableProcess').html(cade);
    }
	function listarOrdenes(){
        $scope.preloader.estado = true;
        webServer
        .getResource('orden_venta',{Salidas:true, Activo:true},'get')
        .then(function(data){
            $scope.Ordenes=data.data.datos;
            listarPersonas();
        },function(data){
            $scope.Ordenes=[];
            listarPersonas();
        });
    }
    function listarProductos(){
        $scope.preloader.estado = true;
        webServer
        .getResource('productos',{producto:true},'get')
        .then(function(data){
            $scope.Productos=data.data.datos;
            listarRemisiones();
        },function(data){
            $scope.Productos=[];
            listarRemisiones();
        });
    }
    function listarMaterias(){
        $scope.preloader.estado = true;
        webServer
        .getResource('materiaPrima',{},'get')
        .then(function(data){
            $scope.Materias=data.data.datos;
            listarSalidasInsumos();
        },function(data){
            $scope.Materias=[];
            listarSalidasInsumos();
        });
    }
    function listarRemisiones(){
        $scope.preloader.estado = true;
        webServer
        .getResource('remision',{},'get')
        .then(function(data){
            $scope.Remisiones=data.data.datos;
            listarEntradasFabricaciones();
        },function(data){
            $scope.Remisiones=[];
            listarEntradasFabricaciones();
        });
    }
    function listarSalidasInsumos(){
        $scope.preloader.estado = true;
        webServer
        .getResource('fabricacion/insumos',{},'get')
        .then(function(data){
            $scope.SalidasInsumos=data.data.datos;
            $scope.preloader.estado = false;
        },function(data){
            $scope.SalidasInsumos=[];
            $scope.preloader.estado = false;
        });
    }
    function listarEntradasFabricaciones(){
        $scope.preloader.estado = true;
        webServer
        .getResource('entrada/remision',{},'get')
        .then(function(data){
            $scope.EntradasFabricaciones=data.data.datos;
            listarFabricaciones();
        },function(data){
            $scope.EntradasFabricaciones=[];
            listarFabricaciones();
        });
    }
    function listarPersonas(){
        $scope.preloader.estado = true;
        webServer
        .getResource('personas',{empleado:true,proveedorfabricacion:true},'get')
        .then(function(data){
            $scope.personas = data.data.datos;
            listarProductos();
        },function(data){
            $scope.personas = [];
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
                    fabricacion_consecutivo : ele.fabricacion_consecutivo,
                    fecha_entrega : new Date (Date.parse(ele.fecha_entrega)),
                    fecha_solicitud : new Date (Date.parse(ele.fecha_solicitud)),
                    productos : ele.productos,
                    procesos : ele.procesos,
                    orden_venta : ele.orden_venta,
                    estado : ele.estado
                };
            }
        });
        return obj;
    }
})