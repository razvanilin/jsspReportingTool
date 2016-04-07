'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DashboardCtrl', function ($scope, Run, runSocket) {
    $scope.run = {};

    $scope.chartSeries = ["Fitness"];
    $scope.chartData = [[]];
    $scope.chartLabels = [];
    $scope.bestGeneration = {};

    $scope.showForm = function() {
      $scope.viewForm = true;
    };

    $scope.registerRun = function() {
      Run.one().customPOST({run: $scope.run}).then(function(data) {
        console.log(data);
        $scope.runData = data;

        // register the chart labels depending on the number of generations
        for (var i=0; i<data.generations; i++) {
          $scope.chartLabels.push(i);
          $scope.chartData[0].push(0);
        }


        $scope.evolutionStarted = true;
      }, function(response) {
        console.log(response);
        $scope.errorMessage = response.data;
      });
    };

    $scope.newEvolution = function() {
      $scope.evolutionStarted = false;
      $scope.evolutionFinished = false;
      $scope.chartData = [[]];
      $scope.chartLabels = [];
      $scope.bestGeneration = {};
    }

    runSocket.on('jar-data', function(data) {
      //console.log(data[0].solution);
      $scope.chartData[0][data[0].generation] = data[0].fitness;
      //console.log($scope.chartData[0]);
      if (data[0].generation == 0) $scope.bestGeneration = data[0];

      if (data[0].fitness < $scope.bestGeneration.fitness) {
        $scope.bestGeneration = data[0];
      }

    });

    runSocket.on('jar-finished', function(data) {
      $scope.chartData[0][data[0].generation] = data[0].fitness;
      //console.log($scope.chartData[0]);
      if (data[0].generation == 0) $scope.bestGeneration = data[0];

      if (data[0].fitness < $scope.bestGeneration.fitness) {
        $scope.bestGeneration = data[0];
      }

      $scope.evolutionFinished = true;
    });

    $scope.stopJar = function() {

      runSocket.emit('jar-stop', "STOP");
      $scope.evolutionFinished = true;
    };
  });
