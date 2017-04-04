'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DashboardCtrl', function ($scope,$state,SesionUsuario, webServer, Tabla,BotonesTabla) {
    $(document).ready(function(){
        $('.modal').modal();
        $('#modal1').modal({
                dismissible: true, // Modal can be dismissed by clicking outside of the modal
                opacity: 0, // Opacity of modal background
                inDuration: 300, // Transition in duration
                outDuration: 200, // Transition out duration
                startingTop: '10%', // Starting top style attribute
                endingTop: '15%', // Ending top style attribute
                ready: function(modal, trigger) {
                    $scope.unidades=true;
                    $scope.categorias=false;
                },
                complete: function() {  } // Callback for Modal close
            }
        );
        $('#modal2').modal({
                dismissible: true, // Modal can be dismissed by clicking outside of the modal
                opacity: 0, // Opacity of modal background
                inDuration: 300, // Transition in duration
                outDuration: 200, // Transition out duration
                startingTop: '10%', // Starting top style attribute
                endingTop: '15%', // Ending top style attribute
                ready: function(modal, trigger) {
                    $scope.unidades=false;
                    $scope.categorias=true;
                },
                complete: function() {  } // Callback for Modal close
            }
        );
    });
    $scope.$state=$state;
    if(SesionUsuario.ObtenerSesion()==null){
        $state.go('Login');
    }else{
        $scope.Usuario=SesionUsuario.ObtenerSesion();
        $scope.NombreDeUsuario='';
        var i=0;
        var contador=0;
        while (i==0) {
            if(contador<$scope.Usuario.nombre.length){
                var caracter = $scope.Usuario.nombre.charAt(contador);
                if(caracter==" "){
                    i=1;
                }else{
                    $scope.NombreDeUsuario+=caracter;
                }
                contador++;
            }else{
                i=1;
            }
        }
        if($scope.Usuario.apellidos){
            $scope.NombreDeUsuario+=' ';
            i=0;
            contador=0;
            while (i==0) {
                if(contador<$scope.Usuario.apellidos.length){
                    var caracter = $scope.Usuario.apellidos.charAt(contador);
                    if(caracter==" "){
                        i=1;
                    }else{
                        $scope.NombreDeUsuario+=caracter;
                    }
                    contador++;
                }else{
                    i=1;
                }
            }
        }
    }

    var casillaDeBotonesModalCategorias = '<div>'+BotonesTabla.BorrarModal+'</div>';
    $scope.gridOptionsModalCategorias = {
        columnDefs: [
            {
                field: 'nombre',
                width:'30%',
                minWidth: 200
            },
            {
                field: 'codigo',
                width:'30%',
                minWidth: 200
            },
            { 
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotonesModalCategorias,
                width:'40%',
                minWidth: 200
            }
        ]
    }
    angular.extend($scope.gridOptionsModalCategorias , Tabla);

    var casillaDeBotonesModalUnidades = '<div>'+BotonesTabla.BorrarModal+'</div>';
    $scope.gridOptionsModalUnidades = {
        columnDefs: [
            {
                field: 'nombre',
                width:'50%',
                minWidth: 200
            },
            { 
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotonesModalUnidades,
                width:'50%',
                minWidth: 200
            }
        ]
    }
    angular.extend($scope.gridOptionsModalUnidades , Tabla);

    $scope.EnviarUnidad=function(){
        webServer
        .getResource('unidades',$scope.Unidad_de_medida,'post')
        .then(function(data){
            $scope.Unidades.push($scope.Unidad_de_medida);
            $scope.Unidad_de_medida={};
            alert('Unidad de medida registrada correctamente');
        },function(data){
            console.log(data.data.message);
        });
    }

    function listarunidades(){
        webServer
        .getResource('unidades',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Unidades=data.data.datos;
                $scope.gridOptionsModalUnidades.data = $scope.Unidades;
            }else{
                $scope.Unidades=[];
                $scope.gridOptionsModalUnidades.data = $scope.Unidades;
            }
        },function(data){
            $scope.Unidades=[];
            $scope.gridOptionsModalUnidades.data = $scope.Unidades;
            console.log(data.data.message);
        });
    }
    listarunidades();

    $scope.EnviarCategoria=function(){
        webServer
        .getResource('categorias',$scope.categoria,'post')
        .then(function(data){
            $scope.Categorias.push($scope.categoria);
            $scope.categoria={};
            alert('Categoria registrada correctamente');
        },function(data){
            console.log(data.data.message);
        });
    }
    $scope.BorrarModal = function(_id){
        if($scope.categorias){
            console.log('Categorias');
        }else{
            console.log('Unidades');
        }
    }
    function listarCategorias(){
        webServer
        .getResource('categorias',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Categorias=data.data.datos;
                $scope.gridOptionsModalCategorias.data = $scope.Categorias;
            }else{
                $scope.Categorias=[];
                $scope.gridOptionsModalCategorias.data = $scope.Categorias;
            }
        },function(data){
            console.log(data.data.message);
            $scope.Categorias=[];
            $scope.gridOptionsModalCategorias.data = $scope.Categorias;
        });
    }
    listarCategorias();
    $scope.sidenav = function(){
        angular.element(".sidenav").toggleClass('sidenav-hidden');
        angular.element(".top-nav").toggleClass('top-nav-hidden');
        angular.element(".perfil").toggleClass('perfil-hidden');
        angular.element(".main-view").toggleClass('main-view-full');
        angular.element(".side-nav>ul>li").click(function(event) {
            if (screen.width<=600) {
                angular.element(".sidenav").addClass('sidenav-hidden');
                angular.element(".top-nav").addClass('top-nav-hidden');
                angular.element(".perfil").addClass('perfil-hidden');
                angular.element(".main-view").addClass('main-view-full');
            }
            
        });
    }
    $scope.active=true;
    $scope.cerrarSesion=function(){
        SesionUsuario.CerrarSesion();
    	$state.go('Login');
    }
  });
