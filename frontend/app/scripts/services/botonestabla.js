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
	Imprimir: '<a type="button" class="btn btn-tabla btn-primary" ng-click="grid.appScope.Imprimir(row.entity)">Imprimir Factura</a>', 
	Detalles : '<a type="button" class="btn btn-tabla btn-success" ng-click="grid.appScope.Detalles(row.entity._id)">Detalles</a>',
	Editar : '<a type="button" class="btn btn-tabla btn-warning" ng-click="grid.appScope.Editar(row.entity._id)">Editar</a>',
	Borrar : '<a type="button" class="btn btn-tabla btn-danger" ng-click="grid.appScope.abrirModal(row.entity._id)">Borrar</a>',
	DetallesModal : '<a type="button" class="btn btn-tabla btn-success" ng-click="grid.appScope.DetallesModal(row.entity._id)">Detalles</a>',
	EditarModal : '<a type="button" class="btn btn-tabla btn-warning" ng-click="grid.appScope.EditarModal(row.entity._id)">Editar</a>',
	BorrarModal : '<a type="button" class="btn btn-tabla btn-danger" ng-click="grid.appScope.BorrarModal(row.entity._id)">Borrar</a>',
	Salida : '<a type="button" class="btn btn-tabla btn-info" ng-click="grid.appScope.AbrirModalSalida(row.entity._id)">Remisión</a>',
	Entrada : '<a type="button" class="btn btn-tabla btn-success" ng-click="grid.appScope.AbrirModalEntrada(row.entity._id)">Entrada</a>',
	MateriaPrima : '<a type="button" class="btn btn-tabla btn-warning" ng-click="grid.appScope.AbrirModalMateriaPrima(row.entity._id)">Materia Prima</a>',
    Factura: '<a type="button" class="btn btn-tabla btn-info" ng-click="grid.appScope.Factura(row.entity)">Generar Factura</a>',

    Borrarorden : '<a type="button" class="btn btn-tabla btn-danger" ng-show="row.entity.estado!=grid.appScope.estadoactivoorden" ng-click="grid.appScope.abrirModal(row.entity._id)">Borrar</a>',
    Borrarfabricacion : '<a type="button" class="btn btn-tabla btn-danger" ng-show="row.entity.estado!=grid.appScope.estadoactivofab" ng-click="grid.appScope.abrirModal(row.entity._id)">Borrar</a>',
    Editarorden : '<a type="button" class="btn btn-tabla btn-warning" ng-show="row.entity.estado!=grid.appScope.estadoactivoorden" ng-click="grid.appScope.Editar(row.entity._id)">Editar</a>',
})