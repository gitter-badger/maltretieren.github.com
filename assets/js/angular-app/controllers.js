'use strict';

myApp.controller("MyCtrl1" ,function ($scope, UtilSrvc) {
    $scope.aVariable = 'anExampleValueWithinScope';
    $scope.valueFromService = UtilSrvc.helloWorld("Amy");
});

myApp.controller("MyCtrl2" ,function ($scope) {

});

myApp.controller("ModalDemoCtrl",function ($scope, $modal, $log) {
  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: '/assets/modal.html',
      controller: 'ModalInstanceCtrl',
	  scope:$scope,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});

myApp.controller("ModalInstanceCtrl",function ($scope, $modalInstance, items) {
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
// you may add more controllers below

myApp.controller("CommentsCtrl",function ($scope) {
	alert("CommentsCtrl init");
});
// you may add more controllers below