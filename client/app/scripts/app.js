'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngResource',
    'ngRoute',
    'restangular',
    'btford.socket-io',
    'chart.js'
  ])
  .config(function ($routeProvider, RestangularProvider, ChartJsProvider) {

    RestangularProvider.setBaseUrl("http://localhost:3000");

    ChartJsProvider.setOptions({
      colours: ['#D63333', '#D63333'],
      responsive: true,
      maintainAspectRatio: false,
      animation: false
    });

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/test', {
        templateUrl: 'views/test.html',
        controller: 'TestCtrl',
        controllerAs: 'test'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  /*
   * Restangular factories
   */
  .factory('TestRestangular', function(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
          RestangularConfigurer.setRestangularFields({
              id: '_id'
          });
      });
  })
  .factory('Test', function(TestRestangular) {
      return TestRestangular.service('test');
  })
  .factory('RunRestangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      return RestangularConfigurer.setRestangularFields({
        id: '_id'
      });
    });
  })
  .factory('Run', function(RunRestangular) {
    return RunRestangular.service('run');
  })
  .factory('runSocket', function(socketFactory) {
    return socketFactory({
      ioSocket: io.connect('http://localhost:3000')
    });
  });
