'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('LoginCtrl', function ($scope, webServer) {
  	$scope.userLogin={};
  	$scope.login=function(){
  		webServer.getResource('personas/login',$scope.userLogin,'post')
  		.then(function(data){
  			console.log(data.data);
  		},function(data){
  			console.log(data);
  		});
  	}
  });
