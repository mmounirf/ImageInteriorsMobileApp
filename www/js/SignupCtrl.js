ImageInteriorsApp.controller('SignupCtrl', function($scope, $ionicLoading, $rootScope, $state, $ionicPopup, $ionicSlideBoxDelegate, $ionicHistory, $ionicSideMenuDelegate, $http, AccountService, DataLoader, $log, $ionicHistory) {

  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  $ionicSideMenuDelegate.canDragContent(false);

  var registerationApi = 'https://image-interiors.com/api/';
  $scope.register = function(user) {

    $ionicLoading.show();
    DataLoader.get(registerationApi+'get_nonce/?controller=user&method=register').then(function(response) {
      $log.debug(response.data);
      var nonce = response.data.nonce

      DataLoader.get(registerationApi+"user/register/?username="+user.username+"&email="+user.email+"&nonce="+nonce+"&display_name="+user.username+"&user_pass="+user.password).then(function(response){
        $log.debug(response.data)
        $ionicLoading.hide();
        var registerationCompleted = $ionicPopup.alert({
          title: 'Registeration Completed',
          template: 'Your account has been created, please signin now'
        });
        registerationCompleted.then(function(res) {
            if(res) {
               $scope.go_to('app.signin')
             }
          });
      }, function(response){
        $log.error(response)
        $ionicLoading.hide();
      })
    }, function(response) {
      $log.error(response);
      var registerationFailed = $ionicPopup.alert({
        title: 'Registeration Failed',
        template: 'Please check your internet connection.'
      });
      $ionicLoading.hide();
    });
  };



})
