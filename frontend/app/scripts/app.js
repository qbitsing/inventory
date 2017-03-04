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
    'uiCropper'
  ])
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
  })
