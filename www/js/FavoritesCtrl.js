ImageInteriorsApp.controller('FavoritesCtrl', function($scope, $ionicModal, $ionicPopup, $ionicLoading, $timeout, DataLoader, $rootScope, $log, $state, $http, AccountService, $q) {

var userInfo = AccountService.get('userInfo');
console.log(userInfo.id)
var favoritesApi = 'http://image-interiors.com/wp-json/favorites/user/'+userInfo.id;

  $scope.loadFavorites = function(){
    $scope.favProducts = [];
    DataLoader.get(favoritesApi).then(function(response) {
      $log.log(favoritesApi, response.data);
      angular.forEach(response.data, function(pID){
        $ionicLoading.show({
          noBackdrop: true
        });
        DataLoader.get('http://image-interiors.com/wp-json/wp/v2/products/'+pID).then(function(response) {
          $scope.favProducts.push(response.data)
          $log.log(response.data);
        });
      });
    });
  }

  $scope.$watch('favProducts', function (newValue, oldValue, scope) {
      if(newValue !== oldValue){
        $ionicLoading.hide();
      }
      console.log($scope.favProducts)
  }, true);

  $scope.loadFavorites();
  $scope.doRefresh = function() {
    $timeout( function() {
      $scope.loadFavorites();
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  };

})
