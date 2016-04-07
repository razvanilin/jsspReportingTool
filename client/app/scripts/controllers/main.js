'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $location, $timeout) {

    // add a fancy effect
    $scope.prepare = function() {
      $scope.loading = true;
      $timeout(function() { $location.path("dashboard");}, 2000);
    }
  });
