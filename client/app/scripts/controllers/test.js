'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:TestCtrl
 * @description
 * # TestCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('TestCtrl', function ($scope, $route, Test) {
    $scope.tests = {};
    $scope.test = {};

    // get the tests from the server
    Test.one().get().then(function(data) {
      var tests = data;
      $scope.tests = tests;
      console.log(data);
    }, function(response) {
      console.log(response);
    });

    // post function
    $scope.post = function() {

      Test.post($scope.test).then(function(data) {
        console.log(data);
        $route.reload();
      }, function(response) {
        console.log(response);
      });

    };
  });
