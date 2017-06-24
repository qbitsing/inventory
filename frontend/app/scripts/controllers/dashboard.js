'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DashboardCtrl', function ($scope, socket, $state, SesionUsuario, webServer, Tabla, BotonesTabla, preloader, server) {
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
    $scope.server=server;
    $scope.categoria={};
    $scope.infoResolucion={};
    if(SesionUsuario.ObtenerSesion()==null){
        $state.go('InicioSesion');
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
        $scope.preloader.estado = true;
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
            if($scope.TituloPanelUnidades=='Registro de Unidades de Medida'){
                $scope.Unidad_de_medida._id=data.data.datos._id;
                $scope.Unidades.unshift($scope.Unidad_de_medida);
            }else{
                $scope.Unidades[$scope.Unidad_de_medida.index] = $scope.Unidad_de_medida;
            }
            $scope.Unidad_de_medida={};
            $scope.preloader.estado = false;
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message , "error");
        });
    }
    $scope.EnviarCategoria=function(){
        $scope.preloader.estado = true;
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
                $scope.Categorias.unshift($scope.categoria);
            }else{
                $scope.Categorias[$scope.categoria.index] = $scope.categoria;
            }
            $scope.categoria={};
            $scope.preloader.estado = false;
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message , "error");
        });
    }
    $scope.EditarModal = function(_id){
        var obj;
        if($scope.categorias){
            $scope.Categorias.forEach(function(ele,index){
                if (ele._id==_id) {
                    obj={
                        _id : ele._id,
                        nombre : ele.nombre,
                        codigo : ele.codigo
                    };
                }
            });
            $scope.categoria = obj;
            $scope.TituloPanelCategorias='Edición de Categorias';
            $scope.TituloBotonCategorias='Editar Categoria';
        }else if($scope.unidades){
            $scope.Unidades.forEach(function(ele,index){
                if (ele._id==_id) {
                    obj={
                        _id : ele._id,
                        nombre : ele.nombre,
                        codigo : ele.codigo
                    };
                }
            });
            $scope.Unidad_de_medida = obj;
            $scope.TituloPanelUnidades='Edición de Unidades de Medida';
            $scope.TituloBotonUnidades='Editar Unidad de Medida';
        }else if($scope.procesos){
            $scope.Procesos.forEach(function(ele,index){
                if (ele._id==_id) {
                    obj={
                        _id : ele._id,
                        nombre : ele.nombre,
                        tipo : ele.tipo,
                        proceso_consecutivo : ele.proceso_consecutivo
                    };
                }
            });
            $scope.proceso = obj;
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
    /*listar*/
    function listarResolucion(){
        webServer
        .getResource('resolucion',{},'get')
        .then(function(data){
            $scope.resolucion=data.data.datos;
            $scope.infoResolucion=data.data.datos;
        },function(data){
            $scope.resolucion={};
            $scope.infoResolucion={};
        });
    }
    function listarProcesos(){
        webServer
        .getResource('procesos',{},'get')
        .then(function(data){
            $scope.Procesos=data.data.datos;
            $scope.gridOptionsModalProcesos.data = $scope.Procesos;
            listarResolucion();
        },function(data){
            $scope.Procesos=[];
            $scope.gridOptionsModalProcesos.data = $scope.Procesos;
            listarResolucion();
        });
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
    /*fin de listar*/

    /*validaciones de numeros*/
    $scope.validarNumeroDesde=function(){
        if ($scope.resolucion.desde<0) {
            $scope.resolucion.desde=0;
        }
    }
    /*fin de las validaciones*/
    $scope.EnviarProceso=function(){
        $scope.preloader.estado = true;
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
                $scope.proceso.proceso_consecutivo=data.data.datos.proceso_consecutivo;
                $scope.Procesos.unshift($scope.proceso);
            }else{
                $scope.Procesos[$scope.proceso.index] = $scope.proceso;
            }
            $scope.proceso={};
            $scope.preloader.estado = false;
            sweetAlert("Completado...", data.data.message , "success");
        },function(data){
            $scope.preloader.estado = false;
            sweetAlert("Oops...", data.data.message , "error");
        });
    }
    $scope.EnviarResolucion=function(){
        if ((JSON.stringify($scope.resolucion)!=JSON.stringify($scope.infoResolucion)) || ($scope.infoResolucion=={} && $scope.resolucion!={})) {
            if ($scope.resolucion.hasta>$scope.resolucion.desde) {
                $scope.preloader.estado = true;
                webServer
                .getResource('resolucion',$scope.resolucion,'post')
                .then(function(data){
                    $scope.infoResolucion=$scope.resolucion;
                    $scope.preloader.estado = false;
                    sweetAlert("Completado...", data.data.message , "success");
                },function(data){
                    $scope.preloader.estado = false;
                    sweetAlert("Oops...", data.data.message , "error");
                });
            }else{
                Materialize.toast("El número 'Hasta:' debe ser mayor al número 'Desde:'", 4000);
                $('#hastaResolucion').focus();
            }
        }else{
            sweetAlert("Completado...", "No hay ningun dato por actualizar" , "success");
        }
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
        $state.go('InicioSesion');
        $scope.preloader.estado = false;
    }
    function scroll(){
         $("html, body").animate({
            scrollTop: 0
        }, 1000); 
    }
    angular.element(".side-nav>ul>li").click(function(){
       scroll();
    });


    /*Chat*/
    /*socket.on('init', function (data) {
        $scope.name = data.name;
        $scope.users = data.users;
        $scope.messages = data.messages;
    });

    socket.on('send:message', function (message) {
        $scope.messages.push(message);
    });*/

    /*socket.on('change:name', function (data) {
        changeName(data.oldName, data.newName);
    });*/

    /*socket.on('user:join', function (data) {
        $scope.messages.push({
            user: 'Chatroom',
            text: 'El usuario ' + data.name + ' se ha conectado.'
        });
        $scope.users.push(data.name);
    });*/

    // add a message to the conversation when a user disconnects or leaves the room
    /*socket.on('user:left', function (data) {
        $scope.messages.push({
            user: 'Chatroom',
            text: 'El usuario ' + data.name + ' se ha desconectado.'
        });
        var i, user;
        for (i = 0; i < $scope.users.length; i++) {
            user = $scope.users[i];
            if (user === data.name) {
                $scope.users.splice(i, 1);
                break;
            }
        }
    });*/

    // Private helpers
    // ===============

    /*var changeName = function (oldName, newName) {
    // rename user in list of users
        var i;
        for (i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i] === oldName) {
                $scope.users[i] = newName;
            }
        }

        $scope.messages.push({
            user: 'Chatroom',
            text: 'El usuario ' + oldName + ' ha cambiado a ' + newName + '.'
        });
    }*/

    // Methods published to the scope
    // ==============================

    /*$scope.changeName = function () {
        socket.emit('change:name', {
            name: $scope.newName
        }, function (result) {
            if (!result) {
                alert('Se ha presentado un error al cambiar el nombre de usuario');
            } else {

                changeName($scope.name, $scope.newName);

                $scope.name = $scope.newName;
                $scope.newName = '';
            }
        });
    };*/

    /*$scope.sendMessage = function () {
        socket.emit('send:message', {
            message: $scope.message
        });

        // add the message to our model locally
        $scope.messages.push({
            user: $scope.name,
            text: $scope.message
        });

        // clear message box
        $scope.message = '';
    };*/
})