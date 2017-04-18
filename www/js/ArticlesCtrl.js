ImageInteriorsApp.controller('ArticlesCtrl', function($scope, $ionicLoading, $timeout, DataLoader, $rootScope, $log) {
  var articlesApi = $rootScope.url + 'articles?_embed';

  $scope.moreItems = false;
  $scope.loadArticles = function() {
    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get(articlesApi).then(function(response) {
      $scope.articles = response.data;
      $scope.moreItems = true;
      $log.log(articlesApi, response.data);
      $ionicLoading.hide();
    }, function(response) {
      $log.log(articlesApi, response.data);
    });
  }

  $scope.loadArticles();
  paged = 2;
  $scope.loadMore = function() {
    if(!$scope.moreItems) {
      return;
    }
    var pg = paged++;
    $log.log('loadMore ' + pg );
    $timeout(function() {
      DataLoader.get( articlesApi + '&page=' + pg ).then(function(response) {
        angular.forEach( response.data, function( value, key ) {
          $scope.articles.push(value);
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
      $scope.loadArticles();
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  };

})
