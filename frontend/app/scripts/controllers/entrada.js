'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EntradaCtrl
 * @description
 * # EntradaCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('EntradaCtrl', function ($scope, $timeout, Tabla, BotonesTabla, webServer) {
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
    $scope.panel_title_form = "Registro de Entradas";
    $scope.button_title_form = "Registrar Entrada";
    $scope.Entrada={};
    $scope.Entrada.orden_compra=[];
    $scope.Entrada.orden_compra.productos=[];
    $scope.Entrada.orden_compra.materia_prima=[];
    var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'orden de compra',field: 'orden_compra.consecutivo',
                width:'20%',
                minWidth: 200
            },
            {
                name:'Factura',field: 'numero_factura',
                width:'20%',
                minWidth: 250
            },
            {
                name:'proveedor',field: 'orden_compra.proveedor.nombre',
                width:'30%',
                minWidth: 250
            },
            {
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotones,
                width:'30%',
                minWidth: 230
            }
        ]
    }
    angular.extend($scope.gridOptions , Tabla);
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
            closeOnCancel: false
        },
        function(isConfirm){
            if (isConfirm) {
                Borrar(_id);
            } else {
                swal("Cancelado", "La entrada no se borrará", "error");
            }
        });
    }
    $scope.Borrar=function(id){
        webServer
        .getResource('entradas/'+id,{},'delete')
        .then(function(data){
            $scope.Entradas.forEach(function(ele, index){
                if(ele._id==id){
                    $scope.Entradas.splice(ele.index,1);
                }
            });
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            sweetAlert("Oops...", data.data.message , "error");
            console.log(data.data.message);
        });
    }
    $scope.EnviarEntrada=function(){
        if ($scope.Entrada.orden_compra.productos) {
            $scope.Entrada.orden_compra.productos.forEach(function(ele, index){
                ele.cantidad_entrante=angular.element('#cantidad'+ele._id).val();
            });
        }
        if ($scope.Entrada.orden_compra.materia_prima) {
            $scope.Entrada.orden_compra.materia_prima.forEach(function(ele, index){
                ele.cantidad_entrante=angular.element('#cantidad'+ele._id).val();
            });            
        }
        webServer
        .getResource('entradas',$scope.Entrada,'post')
        .then(function(data){
            $scope.Entrada._id=data.data.id;
            $scope.Entradas.push($scope.Entrada);
            $scope.Ordenes.forEach(function(ele,ind){
                if (ele._id==$scope.Entrada.orden_compra._id) {
                    if (ele.productos) {
                        ele.productos.forEach(function(elemento,index){
                            data.data.datos.orden_compra.productos.forEach(function(e, i){
                                if(e._id==elemento._id){
                                    elemento=e;
                                }
                            });
                        });
                    }
                    if (ele.materia_prima) {
                        ele.materia_prima.forEach(function(elemento,index){
                            $scope.Entrada.orden_compra.productos.forEach(function(e, i){
                                if(e._id==elemento._id){
                                    elemento=e;
                                }
                            });
                        });
                    }
                }
            });
            $scope.Entrada={};
            $scope.Entrada.orden_compra={};
            $scope.Entrada.orden_compra.productos=[];
            $scope.Entrada.orden_compra.materia_prima=[];
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            sweetAlert("Oops...", data.data.message , "error");
            console.log(data.data.message);
        });
    }
    function listarOrdenes(){
        webServer
        .getResource('orden_compra',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Ordenes=data.data.datos;
            }else{
                $scope.Ordenes=[];
            }
        },function(data){
            $scope.Ordenes=[];
            $scope.gridOptions.data=$scope.Ordenes;
            console.log(data.data.message);
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
        webServer
        .getResource('Entradas',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Entradas=data.data.datos;
            }else{
                $scope.Entradas=[];
            }
            $scope.gridOptions.data=$scope.Entradas;
            listarOrdenes();
        },function(data){
            $scope.Entradas=[];
            $scope.gridOptions.data=$scope.Entradas;
            console.log(data.data.message);
            listarOrdenes();
        });
    }
    listarEntradas();
    function IdentificarEntrada(id , arrObj){
        var obj;
        arrObj.forEach(function(ele , index){
            if(ele._id ==  id){
                obj = {
                    index: index,
                    _id : ele._id,
                    orden_compra : ele.orden_compra,
                    observaciones : ele.observaciones
                };
            }
        });
        return obj;
    }
  });
