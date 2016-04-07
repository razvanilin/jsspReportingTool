'use strict';

describe('Controller: RunCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var RunCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RunCtrl = $controller('RunCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RunCtrl.awesomeThings.length).toBe(3);
  });
});
