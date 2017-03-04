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
      .state('Login',{
        url: '/Login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('Home',{
        url: '/Home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
  })
