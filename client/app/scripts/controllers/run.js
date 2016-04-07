'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RunCtrl
 * @description
 * # RunCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RunCtrl', function ($scope, Run) {
    $scope.viewRuns = true;

    Run.one().get().then(function(runs) {
      console.log(runs);
      $scope.runs = runs;
    }, function(response) {
      console.log(response);
    });
  });
