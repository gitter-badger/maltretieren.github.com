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

/**
 * Receive a complete list of all comments
 */
myApp.controller("CommentsCtrl",function ($scope, $http) {

	var commentsUrl = "https://api.keen.io/3.0/projects/532b3e5a00111c0da1000006/queries/extraction?api_key=fca64cb411fe523d053f2d9b1d159011135be6ce55da682f1ad8d6b1d4f629b84dd564edb1c0d7a0d7575ebaaa79b55daa075f7c866d7430ace403bab51b7513aa41b30ce443f9d736d45d33c78a0b44420c2ecd35223b76d67af37df1d0cc52bf67e73cb32d949eb58cb5814e7e5e6a&event_collection=comments&timezone=3600"

    $http({method: 'GET', url: commentsUrl}).
        success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("Successfully received comments from keen.io")
            $scope.comments = {
                entries: data.result
            }
        }).
        error(function(data, status, headers, config) {
            alert("Error while getting comments from keen.io: "+status)
        });

    $scope.quantity = 5;
    $scope.sortorder = 'created_at'
    $scope.more = function() {
        $scope.quantity += 5;
    }
});