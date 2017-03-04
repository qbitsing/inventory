'use strict';

/**
 * @ngdoc service
 * @name frontendApp.webServer
 * @description
 * # webServer
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('webServer', function ($http) {
	return{
		getResource: function(resource , data, metodo) {
			var URL = "http://localhost:5000/"+resource;
			/*if(SesionUsuario.ObtenerUsuario() != null){
				if(data != undefined)
					data.userAction = SesionUsuario.ObtenerUsuario().id;
				else{
					data = {
						userAction : SesionUsuario.ObtenerUsuario().id
					}
				}
			}*/
			if(metodo=="get"){
				var req = {
	                method : 'GET',
	                url : URL,
	                params : data
	            }
	            return $http(req);
			}
			if(metodo=="post"){
				var req = {
					method : 'POST',
					url : URL,
					data : data
				}
				return $http(req);
			}
			if(metodo=="put"){
				return $http.put(URL, data);
			}
			if(metodo=="delete"){
				return $http.delete(URL, data);
			}
				
		  }
		};
});