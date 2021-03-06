ImageInteriorsApp.controller('CatalogCtrl', function($scope, $http, $ionicPopup, $ionicLoading, $timeout, DataLoader, $rootScope, $log, $stateParams, CacheFactory, $ionicModal, $cordovaSocialSharing) {
  if (!CacheFactory.get('CatalogCache')) {
    CacheFactory.createCache('CatalogCache');
  }
  var CatalogCache = CacheFactory.get('CatalogCache');
  $scope.itemID = $stateParams.catalogId;
  var singleCatalogApi = $rootScope.url + 'catalogs/' + $scope.itemID;

  $scope.loadCatalog = function() {
    $ionicLoading.show({
      noBackdrop: true
    });
    DataLoader.get(singleCatalogApi).then(function(response) {
      $scope.catalog = response.data;
      $log.debug($scope.catalog);
      CatalogCache.put(response.data.id, response.data);
      $ionicLoading.hide();
    }, function(response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });
  }

  if (!CatalogCache.get($scope.itemID)) {
    $scope.loadCatalog();
  } else {
    $scope.catalog = CatalogCache.get($scope.itemID);
  }

  $scope.doRefresh = function() {
    $timeout(function() {
      $scope.loadCatalog();
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  };

  $scope.socialShare = function(catalog_title, catalog_link) {
    var subject = catalog_title
    var message = "Check out " + catalog_title + " catalog."
    $cordovaSocialSharing
      .share(message, subject, null, catalog_link) // Share via native share sheet
      .then(function(result) {}, function(err) {});
  }

  $ionicModal.fromTemplateUrl('templates/request_hard_copy_modal.html', {
    scope: $scope,
    noBackdrop: false,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.requestHardCopyModal = modal;

    $scope.sendRequest = function(catalog, user) {
      console.log(catalog)
      console.log(user)
      $scope.formData = {
        'catalog': catalog,
        'name': user.name,
        'phone': user.phone,
        'address': user.address
      };
      $http({
        method: 'POST',
        url: 'http://image-interiors.com/mobileApp/sendemail.php',
        data: $scope.formData
      }).then(function successCallback(response) {
        $ionicPopup.alert({
          title: 'Request Sent!',
          template: 'Thank you, we received your request and we will contact you shortly'
        }).then(function(res) {
          $scope.requestHardCopyModal.hide();
        });

      }, function errorCallback(response) {
        $ionicPopup.alert({
          title: 'Request Failed!',
          template: 'Error sending your request, please try again later.'
        }).then(function(res) {

        });
      });

    }
  });
})
