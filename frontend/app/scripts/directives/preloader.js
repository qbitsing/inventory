'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:preloader
 * @description
 * # preloader
 */
angular.module('frontendApp')
  .directive('preloader', function (preloader) {
    return {
      templateUrl: 'views/directives/preloader.html',
      restrict: 'E',
      link: function postLink(scope, e, attrs) {
		var el= e[0].getElementsByTagName("SPAN");
		var i = 0;

		setInterval(function () {
			if(!$(el[i]).hasClass('animacion')){
				el[i].className = 'animacion';
			}else{
				el[i].className = '';
			}

			if((el.length -1) > i)
				i ++;
			else 
				i = 0;
		}, 500)
      },
      controller :'DashboardCtrl',
    };
  });
