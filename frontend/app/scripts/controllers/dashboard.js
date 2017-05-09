'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DashboardCtrl', function ($scope,$state,SesionUsuario, webServer, Tabla,BotonesTabla,preloader) {
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
                $scope.procesos=false;
            },
            complete: function() {  } // Callback for Modal close
        });
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
                $scope.procesos=false;
            },
            complete: function() {  } // Callback for Modal close
        });
        $('#modal3').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: 0, // Opacity of modal background
            inDuration: 300, // Transition in duration
            outDuration: 200, // Transition out duration
            startingTop: '10%', // Starting top style attribute
            endingTop: '15%', // Ending top style attribute
            ready: function(modal, trigger) {
                $scope.unidades=false;
                $scope.categorias=false;
                $scope.procesos=true;
            },
            complete: function() {  } // Callback for Modal close
        });
    });
    $scope.preloader = preloader;
    $scope.$state=$state;
    $scope.categoria={};
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
    $scope.TituloPanelCategorias='Registro de Categorias';
    $scope.TituloBotonCategorias='Registrar Categoria';
    var casillaDeBotonesModalCategorias = '<div>'+BotonesTabla.EditarModal+'</div>';
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
    $scope.TituloPanelUnidades='Registro de Unidades de Medida';
    $scope.TituloBotonUnidades='Registrar Unidad de Medida';
    var casillaDeBotonesModalUnidades = '<div>'+BotonesTabla.EditarModal+'</div>';
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
    $scope.TituloPanelProcesos='Registro de procesos de fabricación';
    $scope.TituloBotonProcesos='Registrar Proceso';
    var casillaDeBotonesModalProcesos = '<div>'+BotonesTabla.EditarModal+'</div>';
    $scope.gridOptionsModalProcesos = {
        columnDefs: [
            {
                field: 'nombre',
                width:'33%',
                minWidth: 200
            },
            {
                field : 'interno o externo',
			    cellTemplate : '<div> Proceso {{row.entity.tipo}}</div>',
                width:'33%',
                minWidth: 200
            },
            { 
                name: 'Opciones', enableFiltering: false, cellTemplate :casillaDeBotonesModalProcesos,
                width:'34%',
                minWidth: 200
            }
        ]
    }
    angular.extend($scope.gridOptionsModalProcesos , Tabla);
    $scope.EnviarUnidad=function(){
        var ruta='';
        var metodo='';
        if($scope.TituloPanelUnidades=='Registro de Unidades de Medida'){
            ruta='unidades';
            metodo='post';
        }else{
            ruta='unidades/'+$scope.Unidad_de_medida._id;
            metodo='put';
        }
        webServer
        .getResource(ruta,$scope.Unidad_de_medida,metodo)
        .then(function(data){
            if($scope.TituloPanelCategorias=='Registro de Categorias'){
                $scope.Unidad_de_medida._id=data.data.datos._id;
                $scope.Unidades.push($scope.Unidad_de_medida);
            }else{
                $scope.Unidades[$scope.Unidad_de_medida.index] = $scope.Unidad_de_medida;
            }
            $scope.Unidad_de_medida={};
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            sweetAlert("Oops...", data.data.message , "error");
        });
    }
    function listarunidades(){
        webServer
        .getResource('unidades',{},'get')
        .then(function(data){
            $scope.Unidades=data.data.datos;
            $scope.gridOptionsModalUnidades.data = $scope.Unidades;
            listarCategorias();
        },function(data){
            $scope.Unidades=[];
            $scope.gridOptionsModalUnidades.data = $scope.Unidades;
            listarCategorias();
        });
    }
    listarunidades();

    $scope.EnviarCategoria=function(){
        var ruta='';
        var metodo='';
        if($scope.TituloPanelCategorias=='Registro de Categorias'){
            ruta='categorias';
            metodo='post';
        }else{
            ruta='categorias/'+$scope.categoria._id;
            metodo='put';
        }
        webServer
        .getResource(ruta,$scope.categoria,metodo)
        .then(function(data){
            if($scope.TituloPanelCategorias=='Registro de Categorias'){
                $scope.categoria._id=data.data.datos._id;
                $scope.categoria.codigo=data.data.datos.codigo;
                $scope.Categorias.push($scope.categoria);
            }else{
                $scope.Categorias[$scope.categoria.index] = $scope.categoria;
            }
            $scope.categoria={};
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            sweetAlert("Oops...", data.data.message , "error");
        });
    }
    $scope.EditarModal = function(_id){
        if($scope.categorias){
            $scope.Categorias.forEach(function(ele,index){
                if (ele._id==_id) {
                    $scope.categoria = ele;
                }
            });
            $scope.TituloPanelCategorias='Edición de Categorias';
            $scope.TituloBotonCategorias='Editar Categoria';
        }else if($scope.unidades){
            $scope.Unidades.forEach(function(ele,index){
                if (ele._id==_id) {
                    $scope.Unidad_de_medida = ele;
                }
            });
            $scope.TituloPanelUnidades='Edición de Unidades de Medida';
            $scope.TituloBotonUnidades='Editar Unidad de Medida';
        }else if($scope.procesos){
            $scope.Procesos.forEach(function(ele,index){
                if (ele._id==_id) {
                    $scope.proceso = ele;
                }
            });
            $scope.TituloPanelProcesos='Edición de Procesos';
            $scope.TituloBotonProcesos='Editar Proceso';
        }
    }
    $scope.Cancelar=function(){
        if($scope.categorias){
            $scope.TituloPanelCategorias='Registro de Categorias';
            $scope.TituloBotonCategorias='Registrar Categoria';
            $scope.categoria={};
        }else if($scope.unidades){
            $scope.TituloPanelUnidades='Registro de Unidades de Medida';
            $scope.TituloBotonUnidades='Registrar Unidad de Medida';
            $scope.Unidad_de_medida={};
        }else if($scope.procesos){
            $scope.TituloPanelProcesos='Registro de procesos de fabricación';
            $scope.TituloBotonProcesos='Registrar Proceso';
            $scope.proceso={};
        }
    }
    function listarCategorias(){
        webServer
        .getResource('categorias',{},'get')
        .then(function(data){
            $scope.Categorias=data.data.datos;
            $scope.gridOptionsModalCategorias.data = $scope.Categorias;
            listarProcesos();
        },function(data){
            $scope.Categorias=[];
            $scope.gridOptionsModalCategorias.data = $scope.Categorias;
            listarProcesos();
        });
    }
    function listarProcesos(){
        webServer
        .getResource('procesos',{},'get')
        .then(function(data){
            if(data.data){
                $scope.Procesos=data.data.datos;
                $scope.gridOptionsModalProcesos.data = $scope.Procesos;
            }else{
                $scope.Procesos=[];
                $scope.gridOptionsModalProcesos.data = $scope.Procesos;
            }
        },function(data){
            $scope.Procesos=[];
            $scope.gridOptionsModalProcesos.data = $scope.Procesos;
        });
    }
    $scope.EnviarProceso=function(){
        var ruta='';
        var metodo='';
        if($scope.TituloPanelProcesos=='Registro de procesos de fabricación'){
            ruta='procesos';
            metodo='post';
        }else{
            ruta='procesos/'+$scope.proceso._id;
            metodo='put';
        }
        webServer
        .getResource(ruta,$scope.proceso,metodo)
        .then(function(data){
            if($scope.TituloPanelProcesos=='Registro de procesos de fabricación'){
                $scope.proceso._id=data.data.datos._id;
                $scope.Procesos.push($scope.proceso);
            }else{
                $scope.Procesos[$scope.proceso.index] = $scope.proceso;
            }
            $scope.proceso={};
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            sweetAlert("Oops...", data.data.message , "error");
        });
    }
    $scope.sidenav = function(){
        angular.element(".sidenav").toggleClass('sidenav-hidden');
        angular.element(".top-nav").toggleClass('top-nav-hidden');
        angular.element(".titulo-pagina").toggleClass('titulo-pagina-hidden');
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
    function scroll(){
         $("html, body").animate({
            scrollTop: 0
        }, 1000); 
    }
    angular.element(".side-nav>ul>li").click(function(){
       scroll();
    });
});