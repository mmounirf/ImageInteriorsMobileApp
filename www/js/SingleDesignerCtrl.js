ImageInteriorsApp.controller('DesignerCtrl', function ($scope, $stateParams, DataLoader, $ionicLoading, $rootScope, $sce, CacheFactory, $log, $timeout, $cordovaSocialSharing) {

  if (!CacheFactory.get('DesignerCache')) {
    CacheFactory.createCache('DesignerCache');
  }
  var DesignerCache = CacheFactory.get('DesignerCache');

  if (!CacheFactory.get('ShowroomCache')) {
    CacheFactory.createCache('ShowroomCache');
  }
  var ShowroomCache = CacheFactory.get('ShowroomCache');


  $scope.itemID = $stateParams.designerId;
  var singleDesignerApi = $rootScope.url + 'designers/' + $scope.itemID + '?_embed';
  var singleShowroomApi = $rootScope.url + 'showrooms/';

  $scope.loadDesigner = function () {
    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get(singleDesignerApi).then(function (response) {
      $scope.designer = response.data;


      if ($scope.designer.acf.related_showroom) {
        $scope.getRelatedShowroom($scope.designer.acf.related_showroom.ID);
      }

      $log.debug($scope.designer);
      DesignerCache.put(response.data.id, response.data);
      $ionicLoading.hide();
    }, function (response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });
  }

  $scope.getRelatedShowroom = function (showroom_id) {
    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get(singleShowroomApi + showroom_id + "?_embed").then(function (response) {
      $scope.relatedShowroom = response.data;
      $log.debug($scope.relatedShowroom);
      ShowroomCache.put(response.data.id, response.data);
      $ionicLoading.hide();
    }, function (response) {
      $ionicLoading.hide();
      $log.error('error', response);
    });
  }

  if (!DesignerCache.get($scope.itemID)) {
    $scope.loadDesigner();
  } else {
    $scope.designer = DesignerCache.get($scope.itemID);
    console.log($scope.designer)
    $scope.designer_address_url = "geo:" + $scope.designer.acf.address.lat + "," + $scope.designer.acf.address.lng + "?q=" + $scope.designer.acf.address.address;
    console.log($scope.designer_address_url)
    if ($scope.designer.acf.related_showroom) {
      $scope.relatedShowroom = ShowroomCache.get($scope.designer.acf.related_showroom.ID);
    }
  }


  $scope.doRefresh = function () {
    $timeout(function () {
      $scope.loadDesigner();
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  };


  $scope.socialShare = function (designer_title, designer_link) {
    var subject = designer_title
    var message = "Check " + designer_title + " profile at Image Interiors"
    $cordovaSocialSharing
      .share(message, subject, null, designer_link)
      .then(function (result) {

      }, function (err) {

      });
  }



})
