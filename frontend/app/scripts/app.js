'use strict';

/**
 * @ngdoc overview
 * @name frontendApp
 * @description
 * # frontendApp
 *
 * Main module of the application.
 */
angular
.module('frontendApp', [
    'ui.router',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule',
    'perfect_scrollbar',
    'ui.grid',
    'ui.grid.autoResize',
    'ui.grid.resizeColumns',
    'ui.grid.moveColumns',
    'ui.grid.pagination', 
    'ui.grid.cellNav',
    'mdo-angular-cryptography',
    'uiCropper',
    'ui.materialize'
  ])
  .config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('inventoryPrinesApp')
      .setStorageType('sessionStorage')
      .setNotify(true, true)
})
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/Login');
  $stateProvider
    .state('plain', {
        abstract: true,
        url: '',
        templateUrl: 'views/layouts/plain.html',
    })
    .state('Login',{
        url: '/Login',
        templateUrl: 'views/pages/login.html',
        controller: 'LoginCtrl'
    })
    .state('Home',{
        url: '/Home',
        parent: 'Dashboard',
        templateUrl: 'views/pages/home.html',
        controller: 'HomeCtrl'
    })
    .state('Dashboard', {
        url: '/Dashboard',
        parent: 'plain',
        templateUrl: 'views/layouts/dashboard.html',
        controller: 'DashboardCtrl'
    })
    .state('Perfil',{
        url: '/Perfil',
        parent: 'Dashboard',
        templateUrl: 'views/pages/perfil.html',
        controller: 'PerfilCtrl'
    })
    .state('Personas',{
        url: '/Personas',
        parent: 'Dashboard',
        templateUrl: 'views/pages/Personas.html',
        controller: 'PersonasCtrl'
    })
    .state('Productos',{
        url: '/Productos',
        parent: 'Dashboard',
        templateUrl: 'views/pages/productos.html',
        controller: 'ProductosCtrl'
    })
    .state('Empleados',{
        url: '/Empleados',
        parent: 'Dashboard',
        templateUrl: 'views/pages/empleados.html',
        controller: 'EmpleadosCtrl'
    })
    .state('OrdenVenta',{
        url: '/OrdenVenta',
        parent: 'Dashboard',
        templateUrl: 'views/pages/orden_venta.html',
        controller: 'OrdenVentaCtrl'
    })
    .state('OrdenCompra',{
        url: '/OrdenCompra',
        parent: 'Dashboard',
        templateUrl: 'views/pages/orden_compra.html',
        controller: 'OrdenCompraCtrl'
    })
    .state('MateriaPrima',{
        url: '/MateriaPrima',
        parent: 'Dashboard',
        templateUrl: 'views/pages/materia_prima.html',
        controller: 'MateriaPrimaCtrl'
    })    
})