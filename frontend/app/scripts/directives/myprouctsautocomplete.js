'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:myProuctsAutoComplete
 * @description
 * # myProuctsAutoComplete
 */
 angular.module('frontendApp')
 .directive('myProuctsAutoComplete', function () {
 	return {
 		link: function postLink(scope, element, attrs) {
 			$(element).autocomplete({
 				source: scope[attrs.myProuctsAutoComplete],
 				select: function(ev, ui){
 					ev.preventDefault();

 					scope.myProuctsAutoCompleteResult(ui.item.value);
 				},
 				focus: function(ev, ui){
 					ev.preventDefault();
 					$(this).val(ui.item.label);
 				}
 			});
 		}
 	};
 });
