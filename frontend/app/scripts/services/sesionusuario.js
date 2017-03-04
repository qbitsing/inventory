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
    	CrearSesion:function (user){
    		localStorageService.set("Usuario" , user);
    		return true;
    	}
    }
  });
