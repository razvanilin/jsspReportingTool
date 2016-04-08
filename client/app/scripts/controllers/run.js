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

    $scope.chartSeries = ["Fitness"];
    $scope.chartData = [[]];
    $scope.chartLabels = [];
    $scope.bestGeneration = {};

    Run.one().get().then(function(runs) {
      console.log(runs);
      $scope.runs = runs;
    }, function(response) {
      console.log(response);
    });

    $scope.selectRun = function(run) {
      $scope.runData = run;
      var bestFitness = run.results[0].fitness;
      $scope.bestGeneration = run.results[i];
      for (var i=0; i<run.results.length; i++) {
        $scope.chartLabels.push(run.results[i].generation);
        $scope.chartData[0].push(run.results[i].fitness);

        if (run.results[i].fitness < bestFitness) {
          console.log("yo");
          bestFitness = run.results[i].fitness;
          $scope.bestGeneration = run.results[i];
        }
      }
    }

    $scope.back = function() {
      $scope.runData = null;
      $scope.chartData = [[]];
      $scope.chartLabels = [];
      $scope.bestGeneration = {};
    }
  });
