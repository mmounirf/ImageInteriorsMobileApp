ImageInteriorsApp.controller('ArticleCtrl', function($scope, $ionicLoading, $timeout, DataLoader, $rootScope, $log, $stateParams, CacheFactory, $ionicModal, $cordovaSocialSharing) {
  if (!CacheFactory.get('ArticleCache')) {
    CacheFactory.createCache('ArticleCache');
  }
  var ArticleCache = CacheFactory.get('ArticleCache');
  $scope.itemID = $stateParams.articleId;
  var singleArticleApi = $rootScope.url + 'articles/' + $scope.itemID;

  $scope.loadArticle = function() {
    $ionicLoading.show({
      noBackdrop: true
    });
    DataLoader.get(singleArticleApi).then(function(response) {
      $scope.article = response.data;
      $log.debug($scope.article);
      ArticleCache.put(response.data.id, response.data);
      $ionicLoading.hide();
    }, function(response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });
  }

  if(!ArticleCache.get($scope.itemID)) {
    $scope.loadArticle();
  } else {
    $scope.article = ArticleCache.get( $scope.itemID );
  }

  $scope.doRefresh = function() {
    $timeout( function() {
      $scope.loadArticle();
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  };

  $scope.socialShare = function(article_title, article_link){
    var subject = article_title
    var message = "Check out this article " + catalog_title
    $cordovaSocialSharing
    .share(message, subject, null, article_link) // Share via native share sheet
    .then(function(result) {
    }, function(err) {
    });
  }

})
