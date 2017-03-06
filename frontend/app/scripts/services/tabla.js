'use strict';

/**
 * @ngdoc service
 * @name frontendApp.Tabla
 * @description
 * # Tabla
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .constant('Tabla', {
		enableSorting: true,
		modifierKeysToMultiSelectCells: true,
		enableFiltering: true,
		paginationPageSizes: [10, 20, 30, 40, 50, 100],
		paginationPageSize: 10,
		enableColumnResizing: true,
	});
