ImageInteriorsApp.controller('ShowroomCtrl', function($scope, $stateParams, DataLoader, $ionicLoading, $rootScope, $sce, CacheFactory, $log, Bookmark, $timeout, $cordovaSocialSharing) {


  if (!CacheFactory.get('ShowroomCache')) {
    CacheFactory.createCache('ShowroomCache');
  }
  var ShowroomCache = CacheFactory.get('ShowroomCache');
  $scope.itemID = $stateParams.showroomId;
  var singleShowroomApi = $rootScope.url + 'showrooms/' + $scope.itemID + '?_embed';

  $scope.loadShowroom = function() {
    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get(singleShowroomApi).then(function(response) {
      $scope.showroom = response.data;
      $scope.getShowroomListing($scope.showroom.slug);
      var latLng = new google.maps.LatLng($scope.showroom.acf.map.lat, $scope.showroom.acf.map.lng);
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      $scope.map = new google.maps.Map(document.getElementById("showroom-map"), mapOptions);
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });
      var infoWindow = new google.maps.InfoWindow({
        content: '<b>'+$scope.showroom.title.rendered+'</b></br>' + $scope.showroom.acf.map.address
        });

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
        });
      });

      $log.debug($scope.showroom);
      ShowroomCache.put(response.data.id, response.data);
      $ionicLoading.hide();
    }, function(response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });
}

$scope.getRelatedProducts = function(url){
  $ionicLoading.show({
    noBackdrop: true
  });

  DataLoader.get(url+"&per_page=100").then(function(response) {
    $scope.relatedProducts = response.data;
    $ionicLoading.hide();
  }, function(response) {
    $ionicLoading.hide();
    $log.error('error', response);
  });
}


$scope.getShowroomListing = function(showroomSlug){
  $ionicLoading.show({
    noBackdrop: true
  });
  var showroomListingApi = $rootScope.url + 'showroom_listing?slug=' + showroomSlug;
  DataLoader.get(showroomListingApi).then(function(response) {
    var relatedProductsApi = response.data[0]._links['wp:post_type'][0].href;
    $ionicLoading.hide();
    $scope.getRelatedProducts(relatedProductsApi)
  }, function(response) {

    $log.error('error', response);
    $ionicLoading.hide();
  });
}


  if(!ShowroomCache.get($scope.itemID)) {
    $scope.loadShowroom();
  } else {
    $scope.showroom = ShowroomCache.get( $scope.itemID );
    $scope.getShowroomListing($scope.showroom.slug);
    var latLng = new google.maps.LatLng($scope.showroom.acf.map.lat, $scope.showroom.acf.map.lng);
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("showroom-map"), mapOptions);
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
    var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });
    var infoWindow = new google.maps.InfoWindow({
      content: '<b>'+$scope.showroom.title.rendered+'</b></br>' + $scope.showroom.acf.map.address
      });

    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open($scope.map, marker);
      });
    });
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

$scope.socialShare = function(showroom_title, showroom_link){
  var subject = "Awesome Showroom"
  var message = "Check " + showroom_title + ", I just saw in Image Interiors catalog."
  $cordovaSocialSharing
  .share(message, subject, null, showroom_link) // Share via native share sheet
  .then(function(result) {

  }, function(err) {

  });
}

  $scope.externalUrl = function(url){
    navigator.app.loadUrl(url, {openExternal : true});
  }

  $scope.doRefresh = function() {
    $timeout( function() {
      $scope.loadShowroom();
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  };

})
