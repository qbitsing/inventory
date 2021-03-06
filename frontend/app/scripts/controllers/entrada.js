'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EntradaCtrl
 * @description
 * # EntradaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('EntradaCtrl', function ($state, $scope, $timeout, Tabla, BotonesTabla, webServer, preloader) {
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
  	$scope.panelAnimate='';
    $scope.pageAnimate='';
    if ($scope.Usuario.rol=='Contador') {
        $state.go('Home');
    }
    $timeout(function () {
        $scope.pageAnimate='pageAnimate';
        $scope.panelAnimate='panelAnimate';
    },100);
    $scope.panel_title_form = "Registro de Entradas";
    $scope.button_title_form = "Registrar Entrada";
    $scope.Entrada={};
    $scope.Entrada.orden_compra=[];
    $scope.Entrada.orden_compra.productos=[];
    $scope.Entrada.orden_compra.materia_prima=[];
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles;
    if ($scope.Usuario.rol=='Super Administrador') {
        casillaDeBotones+=BotonesTabla.Borrar;
    }
    casillaDeBotones+='</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'No. entrada',field: 'entrada_consecutivo',
                width:'15%',
                minWidth: 100,
                type: 'number',
                enableSorting: true
            },
            {
                name:'orden de compra',field: 'orden_compra.orden_compra_consecutivo',
                width:'15%',
                minWidth: 100
            },
            {
                name:'fecha',
                width:'15%',
                cellTemplate: '<div>{{grid.appScope.convertirFecha(row.entity.fecha)}}</div>',
                minWidth: 100
            },
            {
                name:'proveedor',field: 'orden_compra.proveedor.nombre',
                width:'30%',
                minWidth: 250
            },
            {
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'25%',
                minWidth: 230
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);
    $scope.CancelarEditar=function(){
        $scope.Entrada={};
        $scope.Entrada.orden_compra={};
        $scope.Entrada.orden_compra.productos=[];
        $scope.Entrada.orden_compra.materia_prima=[];
        $scope.Orden.compra='';
    }
    $scope.CargarOrden=function(){
        $scope.Ordenes.forEach(function(ele, index){
            if(ele._id==$scope.Orden.compra){
                $scope.Entrada.orden_compra=ele;
            }
        });
        if(!$scope.Entrada.orden_compra.productos){
            $scope.Entrada.orden_compra.productos=[];
        }
        if(!$scope.Entrada.orden_compra.materia_prima){
            $scope.Entrada.orden_compra.materia_prima=[];
        }
    }
    $scope.convertirFecha = function(fecha){
        var date = new Date(fecha).getDate();
        date += '/'+(new Date(fecha).getMonth()+1);
        date += '/'+new Date(fecha).getFullYear();
        return date;
    }
    $scope.abrirModal=function(_id){
        swal({
            title: "Confirmar Eliminación",
            text: "¿Esta seguro de borrar la entrada?",
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
        .getResource('entradas/'+id,{},'delete')
        .then(function(data){
            $scope.Ordenes.forEach(function(ele,ind){
                if (ele._id==data.data.datos.orden_compra._id) {
                    $scope.Ordenes[ind] = data.data.datos.orden_compra;
                }
            });
            $scope.Entradas.forEach(function(ele, index){
                if (ele._id==id) {
                    $scope.Entradas.splice(index,1);
                }
            });
            swal("Completado...", data.data.message , "success");
        },function(data){
            swal("Oops...", data.data.message , "error");
        });
    }    
    $scope.EnviarEntrada=function(){
        $scope.preloader.estado = true;
        var contadorcantidades=false;
        if ($scope.Entrada.orden_compra.productos) {
            $scope.Entrada.orden_compra.productos.forEach(function(ele, index){
                if (ele.cantidad_faltante>0) {
                    ele.cantidad_entrante=parseInt(angular.element('#cantidad'+ele._id).val());
                    if (parseInt(angular.element('#cantidad'+ele._id).val())>0) {
                        contadorcantidades=true;
                    }
                }else{
                    ele.cantidad_entrante=0;
                }
            });
        }
        if ($scope.Entrada.orden_compra.materia_prima) {
            $scope.Entrada.orden_compra.materia_prima.forEach(function(ele, index){
                if (ele.cantidad_faltante>0) {
                    ele.cantidad_entrante=parseInt(angular.element('#cantidad'+ele._id).val());
                    if (parseInt(angular.element('#cantidad'+ele._id).val())>0) {
                        contadorcantidades=true;
                    }
                }else{
                    ele.cantidad_entrante=0;
                }
            });            
        }
        $scope.Entrada.estado='Activo';
        if (contadorcantidades) {
            $scope.Entrada.fecha=new Date(Date.now());
            webServer
            .getResource('entradas',$scope.Entrada,'post')
            .then(function(data){
                $scope.Entrada._id=data.data.datos._id;
                $scope.Entrada.entrada_consecutivo=data.data.datos.entrada_consecutivo;
                $scope.Entradas.unshift($scope.Entrada);
                $scope.Ordenes.forEach(function(ele,ind){
                    if (ele._id==$scope.Entrada.orden_compra._id) {
                        $scope.Ordenes[ind] = data.data.datos.orden_compra;
                    }
                });
                $scope.Entrada={};
                $scope.Entrada.orden_compra={};
                $scope.Entrada.orden_compra.productos=[];
                $scope.Entrada.orden_compra.materia_prima=[];
                $scope.Orden.compra='';
                $scope.preloader.estado = false;
                sweetAlert("Completado...", data.data.message , "success");
            },function(data){
                $scope.preloader.estado = false;
                sweetAlert("Oops...", data.data.message , "error");
            });
        }else{
            $scope.preloader.estado=false;
            sweetAlert("Oops...", "Ingrese cantidades validas para efectuar la entrada" , "error");
        }
    }
    function listarOrdenes(){
        webServer
        .getResource('orden_compra',{Activo: true, Entradas:true, Finalizado:true},'get')
        .then(function(data){
            $scope.Ordenes=data.data.datos;
            $scope.preloader.estado = false;
        },function(data){
            $scope.Ordenes=[];
            $scope.preloader.estado = false;
        });
    }
    $scope.Detalles = function(id){
        $scope.Detalle = $scope.Entradas.find(function(ele){
            if(ele._id == id){
                return ele;
            }
        });
        if(!$scope.Detalle.orden_compra.materia_prima){
            $scope.Detalle.orden_compra.materia_prima=[];
        }
        if(!$scope.Detalle.orden_compra.productos){
            $scope.Detalle.orden_compra.productos=[];
        }
        $('#modaldeDetalles').modal('open');
    }
    function listarEntradas(){
        $scope.preloader.estado = true;
        webServer
        .getResource('Entradas',{},'get')
        .then(function(data){
            $scope.Entradas=data.data.datos;
            $scope.gridOptions.data=$scope.Entradas;
            var height
            if ($scope.gridOptions.data.length >= 25 ){
                height = (30 * 25) + 140
            }
            else {
                height = (30 * $scope.gridOptions.data.length) + 140
            }
            $('.grid').height(height)
            listarOrdenes();
        },function(data){
            $scope.Entradas=[];
            $scope.gridOptions.data=$scope.Entradas;
            listarOrdenes();
        });
    }
    listarEntradas();
})