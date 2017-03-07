'use strict';

/**
 * @ngdoc service
 * @name frontendApp.BotonesTabla
 * @description
 * # BotonesTabla
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .constant('BotonesTabla', {
	Detalles : `<a type="button" class="btn btn-tabla btn-success" ng-click="grid.appScope.Detalles(row.entity.id)">Detalles</a>`,
	Editar : `<a type="button" class="btn btn-tabla btn-warning" ng-click="grid.appScope.Editar(row.entity.id)">Editar</a>`,
	Borrar : `<a type="button" class="btn btn-tabla btn-danger" ng-click="grid.appScope.Borrar(row.entity.id)">Borrar</a>`
});
