ImageInteriorsApp.controller('CatalogsCtrl', function($scope, $ionicLoading, $timeout, DataLoader, $rootScope, $log) {
  var catalogsApi = $rootScope.url + 'catalogs?_embed';

  $scope.moreItems = false;
  $scope.loadCatalogs = function() {
    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get(catalogsApi).then(function(response) {
      $scope.catalogs = response.data;
      $scope.moreItems = true;
      $log.log(catalogsApi, response.data);
      $ionicLoading.hide();
    }, function(response) {
      $log.log(catalogsApi, response.data);
    });
  }

  $scope.loadCatalogs();
  paged = 2;
  $scope.loadMore = function() {
    if(!$scope.moreItems) {
      return;
    }
    var pg = paged++;
    $log.log('loadMore ' + pg );
    $timeout(function() {
      DataLoader.get( catalogsApi + '&page=' + pg ).then(function(response) {
        angular.forEach( response.data, function( value, key ) {
          $scope.catalogs.push(value);
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
      $scope.loadCatalogs();
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  };

})
