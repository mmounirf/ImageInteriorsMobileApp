ImageInteriorsApp.controller('ProductCtrl', function($scope, $stateParams, DataLoader, $ionicLoading, $rootScope, $sce, CacheFactory, $log, Bookmark, $timeout, $cordovaSocialSharing) {


  if (!CacheFactory.get('ProductCache')) {
    CacheFactory.createCache('ProductCache');
  }
  var ProductCache = CacheFactory.get('ProductCache');
  $scope.itemID = $stateParams.productId;
  var singleProductApi = $rootScope.url + 'products/' + $scope.itemID;

  $scope.loadProduct = function() {
    $ionicLoading.show({
      noBackdrop: true
    });
    DataLoader.get(singleProductApi).then(function(response) {
      $scope.product = response.data;

      $log.debug($scope.product);
      ProductCache.put(response.data.id, response.data);
      $ionicLoading.hide();
    }, function(response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });
  }

  if(!ProductCache.get($scope.itemID)) {
    $scope.loadProduct();
  } else {
    $scope.product = ProductCache.get( $scope.itemID );
  }

  $scope.bookmarked = Bookmark.check( $scope.itemID );
  $scope.bookmarkItem = function( id ) {
    if( $scope.bookmarked ) {
      Bookmark.remove( id );
      $scope.bookmarked = false;
    } else {
      Bookmark.set( id );
      $scope.bookmarked = true;
    }
  }

$scope.socialShare = function(product_title, product_link){
  var subject = "Awesome Product"
  var message = "Check " + product_title + ", I just saw in Image Interiors catalog."
  $cordovaSocialSharing
  .share(message, subject, null, product_link) // Share via native share sheet
  .then(function(result) {

  }, function(err) {

  });
}
})
