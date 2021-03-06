'use strict';

/**
 * @ngdoc service
 * @name frontendApp.SesionUsuario
 * @description
 * # SesionUsuario
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('SesionUsuario', function (localStorageService) {
    return{
    	CrearSesion: function (user){
            if(user.super_administrador){
                user.rol='Super Administrador';
            }else if(user.contador){
                user.rol='Contador';
            }else if(user.almacenista){
                user.rol='Almacenista';
            }else if(user.empleado){
                user.rol='Empleado';
            }
    		localStorageService.set('Usuario' , user);
    		return true;
    	},
        ObtenerSesion : function(){
            return localStorageService.get('Usuario');
        },
    	CerrarSesion : function(){
    		return localStorageService.remove('Usuario');
    	},
        ActualizarSesion: function(user){
            localStorageService.set('Usuario',user);
        }
    }
  })
