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
            // if($scope.panel_title_form=="Registro de Productos"){
            //     $scope.Productos.push($scope.Persona);
            //     alert('Persona registrada correctamente');
            // }else{
            //     $scope.Personas[$scope.Persona.index] = $scope.Persona;
            //     alert('Persona actualizada correctamente');
            // }
            // $scope.Persona={};
            console.log(data);
        },function(data){
            console.log(data);
        });
    }
});
