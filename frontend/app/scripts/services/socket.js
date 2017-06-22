'use strict';

/**
 * @ngdoc service
 * @name frontendApp.socket
 * @description
 * # socket
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
  .factory('socket', function ($rootScope) {
    /*var socket=io.connect('http://localhost:5000');*/
    return {
	    /*on: function (eventName, callback) {
	      	socket.on(eventName, function () {  
		        var args = arguments;
		        $rootScope.$apply(function () {
		          	callback.apply(socket, args);
		        });
	      	});
	    },
	    emit: function (eventName, data, callback) {
	      	socket.emit(eventName, data, function () {
	        	var args = arguments;
	        	$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
	        	});
	      	})
	    }*/
	 };
  });