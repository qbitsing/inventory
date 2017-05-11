'use strict';

/**
 * @ngdoc service
 * @name frontendApp.preloader
 * @description
 * # preloader
 * Value in the frontendApp.
 */
angular.module('frontendApp')
  .factory('preloader', function (){
  	var preloader = { estado: false }
  	return preloader;
  });
