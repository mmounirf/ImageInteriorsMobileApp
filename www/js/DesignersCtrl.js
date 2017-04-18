ImageInteriorsApp.controller('DesignersCtrl', function($scope, $ionicModal, $ionicLoading, $timeout, DataLoader, $rootScope, $log, $state) {
  var designersApi = $rootScope.url + 'designers?_embed';
  $scope.moreItems = false;
  $scope.loadDesigners = function() {
    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get(designersApi).then(function(response) {
      $scope.designers = response.data;
      $scope.moreItems = true;
      $log.log(designersApi, response.data);
      $ionicLoading.hide();
    }, function(response) {
      $log.log(designersApi, response.data);
    });
  }

  $scope.loadDesigners();
  paged = 2;
  $scope.loadMore = function() {
    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;
    $log.log('loadMore ' + pg );
    $timeout(function() {
      DataLoader.get(designersApi + '&page=' + pg).then(function(response) {
        angular.forEach( response.data, function( value, key ) {
          $scope.designers.push(value);
        });

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
        }
      }, function(response) {
          $scope.moreItems = false;
          $scope.lastPage = true;
          $log.error(response);
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');

    }, 1000);
  }

  $scope.moreDataExists = function() {
    return $scope.moreItems;
  }


  $scope.doRefresh = function() {
    $timeout( function() {
      $scope.loadDesigners();
      $scope.$broadcast('scroll.refreshComplete');

    }, 1000);

  };

})
