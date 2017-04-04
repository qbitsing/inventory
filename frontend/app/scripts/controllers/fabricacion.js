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
	$scope.fabricacion.productos=[];
	var casillaDeBotones = '<div>'+BotonesTabla.Detalles+BotonesTabla.Borrar+'</div>';
    $scope.gridOptions = {
        columnDefs: [
            {
                name:'orden de fabricacion',field: 'consecutivo',
                width:'20%',
                minWidth: 200
            },
            {
                name:'persona responsable',field: 'responsable.nombre',
                width:'20%',
                minWidth: 250
            },
            {
                name:'fecha de solicitud',field: 'fecha_solicitud',
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
    $scope.BorrarProducto=function(index){
        $scope.fabricacion.productos.splice(index,1);
    }
    $scope.EnviarFabricacion=function(){
        var ruta="";
        var metodo="";
        if ($scope.panel_title_form=="Registro de venta") {
            ruta="fabricacion";
            metodo="post";
        }else{
            ruta="fabricacion/"+$scope.fabricacion._id;
            metodo="put";
        }
        webServer
        .getResource(ruta,$scope.fabricacion,metodo)
        .then(function(data){
            $scope.personas.forEach(function(ele, index){
                if(ele._id==$scope.fabricacion.responsable._id){
                    $scope.fabricacion.responsable=ele;
                }
            });
            if($scope.panel_title_form=="Registro de fabricación"){
                $scope.Fabricaciones.push($scope.fabricacion);
                alert('Fabricación registrada correctamente');
            }else{
                $scope.Fabricaciones[$scope.fabricacion.index] = $scope.fabricacion;
                alert('Fabricación actualizada correctamente');
            }
            $scope.fabricacion={};
            $scope.fabricacion.productos=[];
            $scope.fabricacion.consecutivo=0;
            $scope.Fabricaciones.forEach(function(ele, index){
                if(ele.consecutivo>=$scope.fabricacion.consecutivo){
                    $scope.fabricacion.consecutivo=ele.consecutivo;
                }
            });
            $scope.fabricacion.consecutivo=$scope.fabricacion.consecutivo+1;
        },function(data){
            console.log(data);
        });
    }
    $scope.AgregarProducto=function(){
        var controlador=false;
        var obj = {
            _id : $scope.producto._id.split(',')[0],
            nombre : $scope.producto._id.split(',')[1],
            cantidad : $scope.producto.cantidad
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
    function listarFabricaciones(){
        webServer
        .getResource('fabricacion',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Fabricaciones=data.data.datos;
                $scope.gridOptions.data=$scope.Fabricaciones;
                $scope.fabricacion.consecutivo=0;
                $scope.Fabricaciones.forEach(function(ele, index){
                    if(ele.consecutivo>=$scope.fabricacion.consecutivo){
                        $scope.fabricacion.consecutivo=ele.consecutivo;
                    }
                });
                $scope.fabricacion.consecutivo=$scope.fabricacion.consecutivo+1; 
            }else{
                $scope.fabricacion.consecutivo=1;
                $scope.Fabricaciones=[];
                $scope.gridOptions.data=$scope.Fabricaciones;
            }
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
            $scope.gridOptions.data=$scope.Ordenes;
            console.log(data.data.message);
            listarPersonas();
        });
    }
    function listarPersonas(){
        webServer
        .getResource('personas',{administrador:true,almacenista:true,contador:true,empleado:true},'get')
        .then(function(data){
            if(data.data){
                $scope.personas = data.data.datos;
            }else{
                $scope.personas = [];
            }
        },function(data){
            console.log(data);
        });
    }
	listarFabricaciones();
});