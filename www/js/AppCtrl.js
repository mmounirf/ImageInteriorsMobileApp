ImageInteriorsApp.controller('AppCtrl', function($scope, $ionicModal, $timeout, $sce, DataLoader, $rootScope, $log, $state) {
  $rootScope.url = 'http://image-interiors.com/wp-json/wp/v2/';
  if(ionic.Platform.isIOS()){
    $rootScope.os = 'ios';
  }else{
    $rootScope.os = 'android';
  }
  $rootScope.go_to = function(page_name){
    $state.go(page_name)
  }
})
