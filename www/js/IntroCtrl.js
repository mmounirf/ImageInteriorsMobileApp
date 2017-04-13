ImageInteriorsApp.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicHistory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.startApp = function() {
    $state.go('app.products');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

})
