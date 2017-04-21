ImageInteriorsApp.controller('SigninCtrl', function($scope, $ionicLoading, $rootScope, $state, $ionicPopup, $ionicSlideBoxDelegate, $ionicHistory, $ionicSideMenuDelegate, $http, AccountService, DataLoader, $log, $ionicHistory) {

  var userApi = 'http://image-interiors.com/wp-json/wp/v2/users/me';
  if(AccountService.get('userAccount')){
    $state.go('app.products')
  }

  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  $ionicSideMenuDelegate.canDragContent(false);

  $scope.togglePassword = function(){
    $scope.showPassword = !$scope.showPassword;
  }

  $scope.signin = function(user){
    $ionicLoading.show({
      noBackdrop: false
    });
    $http.post('http://image-interiors.com/wp-json/jwt-auth/v1/token', {
        username: user.username,
        password: user.password
      })

      .then(function(response) {
        console.log(response.data)
        AccountService.set('userAccount', response.data)
        $rootScope.userAccount = response.data;
        $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;

        //Getting user info
        DataLoader.get(userApi).then(function(response) {
          console.log(response)
          AccountService.set('userInfo', response.data)
          $log.log(userApi, response.data);
        }, function(response) {
          $log.log(userApi, response.data);
        });

        $state.go('app.products')
        $ionicLoading.hide();
      })

      .catch( function(error) {
        if(error.status === -1){
          var loginFailedAlert = $ionicPopup.alert({
            title: 'Failed to signin',
            template: 'Please check your internet connection'
          });
        }
        if(error.status === 403){
          var loginFailedAlert = $ionicPopup.alert({
            title: 'Failed to signin',
            template: 'Please check your username and password'
          });
        }
        $ionicLoading.hide();
      });
  }



})
