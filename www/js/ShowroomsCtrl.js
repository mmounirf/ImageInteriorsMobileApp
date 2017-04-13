ImageInteriorsApp.controller('ShowroomsCtrl', function($scope, $stateParams, DataLoader, $ionicLoading, $rootScope, $sce, CacheFactory, $log, Bookmark, $timeout) {

  var showroomsApi = $rootScope.url + 'showrooms?_embed';
  $scope.moreItems = false;
  $scope.loadShowrooms = function() {
    $ionicLoading.show({
      noBackdrop: true
    });

    // Get all of our products
    DataLoader.get( showroomsApi ).then(function(response) {
      $scope.showrooms = response.data;
      $scope.moreItems = true;
      $log.log(showroomsApi, response.data);
      $ionicLoading.hide();
    }, function(response) {
      $log.log(showroomsApi, response.data);
    });
  }

  $scope.loadShowrooms();
  paged = 2;

  $scope.loadMore = function() {
    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;
    $log.log('loadMore ' + pg );
    $timeout(function() {
      DataLoader.get( showroomsApi + '&page=' + pg ).then(function(response) {
        angular.forEach( response.data, function( value, key ) {
          $scope.showrooms.push(value);
        });

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
          $scope.lastPage = true;
        }
      }, function(response) {
        $scope.moreItems = false;

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
      $scope.loadShowrooms();
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  };


})
