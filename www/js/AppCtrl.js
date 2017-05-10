ImageInteriorsApp.controller('AppCtrl', function($scope, AccountService, $ionicModal, $timeout, $sce, DataLoader, $rootScope, $log, $state, $ionicLoading, $http) {
  $rootScope.url = 'http://image-interiors.com/wp-json/wp/v2/';
  if(ionic.Platform.isIOS()){
    $rootScope.os = 'ios';
  }else{
    $rootScope.os = 'android';
  }
  $rootScope.go_to = function(page_name){
    $state.go(page_name)
  }

  $rootScope.openUrl = function(url){
    console.log(url)
    window.open(url, '_system');
  }

  $rootScope.userAccount = AccountService.get('userAccount');
  $scope.logout = function(){
    $ionicLoading.show();
    AccountService.destroy('userAccount');
    AccountService.destroy('userInfo');
    $http.defaults.headers.common.Authorization = '';
    $state.go('app.signin')
    $ionicLoading.hide();
  }
})
