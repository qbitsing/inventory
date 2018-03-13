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
		paginationPageSizes: [25, 35, 45, 55, 100],
		paginationPageSize: 25,
		enableColumnResizing: true,
		minRowsToShow:10,
	})
