ImageInteriorsApp.controller('SignupCtrl', function($scope, $ionicLoading, $rootScope, $state, $ionicPopup, $ionicSlideBoxDelegate, $ionicHistory, $ionicSideMenuDelegate, $http, AccountService, DataLoader, $log, $ionicHistory) {

  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  

  $ionicSideMenuDelegate.canDragContent(false);
  $scope.togglePassword = function(){
    $scope.showPassword = !$scope.showPassword;
  }
  
  
  
  var getNonce = 'http://image-interiors.com/api/get_nonce/?controller=user&method=register';
  var registerationApi = 'http://image-interiors.com/api/user/register/?insecure=cool&';
  
  
  $scope.register = function(user) {
    $ionicLoading.show();
	$http.get(getNonce).then(function(response) {
		var nonce = response.data.nonce;
		console.log(nonce);
		$http.post(registerationApi+
		"username="+user.username+
		"&email="+user.email+
		"&user_pass="+user.password+
		"&display_name="+user.username+
		"&nonce="+nonce,
		"&notify=no"
		).then(function(response){
			console.log(response);
			$ionicLoading.hide();
			$ionicPopup.alert({
				title: 'Registeration Completed',
				template: 'Your account has been created, please signin now'
			  });
			 $scope.go_to('app.signin')
			
		}).catch(function(error){
			console.log(error)
			$ionicLoading.hide();
			if(error.data.error=="Username already exists."){
			$ionicPopup.alert({
				title: 'Registeration Failed',
				template: 'Username already exists.'
			  });
			}
			
			if(error.data.error=="E-mail address is already in use."){
			$ionicPopup.alert({
				title: 'Registeration Failed',
				template: 'Email already exists.'
			  });
			}			
		});
		
	}).catch( function(error) {
		$ionicLoading.hide();
		$ionicPopup.alert({
            title: 'Registeration Failed',
            template: 'Please check your internet connection'
          });
	});
	
  };



})
