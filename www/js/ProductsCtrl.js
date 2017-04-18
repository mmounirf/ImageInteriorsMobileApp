ImageInteriorsApp.controller('ProductsCtrl', function( $scope, $http, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $log, $ionicLoading, $state, $ionicModal) {
  var productsApi = $rootScope.url + 'products';
  var productStylesApi = $rootScope.url + 'product_style?per_page=100';
  var productsTypesApi = $rootScope.url + 'product_type?per_page=100';
  var productsCategoriesApi = $rootScope.url + 'product_category?per_page=100';
  var productsFilterApi = productsApi + '?per_page=100';
  var filtersApi;

  $scope.filters = [{name: "Styles"}, {name: "Types"}, {name: "Categories"}];
  $scope.selectedFilters = {};
  // Get all styles
  DataLoader.get( productStylesApi ).then(function(response) {
    $scope.styles = response.data;
    $scope.filters[0].items = $scope.styles;
  });

  // Get all types
  DataLoader.get( productsTypesApi ).then(function(response) {
    $scope.types = response.data;
    $scope.filters[1].items = $scope.types;
  });

  // Get all categories
  DataLoader.get( productsCategoriesApi ).then(function(response) {
    $scope.categories = response.data;
    $scope.filters[2].items = $scope.categories;
  });

  $scope.removeFilter = function(filter){
    delete $scope.selectedFilters[filter];
    $scope.applyFilters($scope.selectedFilters);
  }

  $scope.moreItems = false;
  $scope.loadProducts = function() {
    $ionicLoading.show({
      noBackdrop: true
    });

    if(!$scope.selectedFilters.style && !$scope.selectedFilters.type && !$scope.selectedFilters.category){
      var api = productsApi;
    }else{
      var api = filtersApi;
    }

    // Get all of our products
    DataLoader.get(api).then(function(response) {
      $scope.products = response.data;
      $scope.moreItems = true;
      $log.log(api, response.data);
      $ionicLoading.hide();
    }, function(response) {
      $log.log(api, response.data);
    });
  }

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $ionicModal.fromTemplateUrl('templates/filters_modal.html', {
     scope: $scope,
     animation: 'slide-in-up'
  }).then(function(modal) {
     $scope.filtersModal = modal;
     productsFilterApi = productsApi + '?per_page=100';
  });

  $scope.closeFiltersModal = function(){
    $scope.selectedFilters = {};
    $scope.filtersModal.hide();
  }

  $scope.applyFilters = function(filtersObj){
    $scope.filtersModal.hide();
    $ionicLoading.show({
      noBackdrop: true
    });

      filtersApi = productsFilterApi.substr('&');
      for (var key in $scope.selectedFilters) {
        filtersApi += "&product_" + key + "=" + $scope.selectedFilters[key].id;
      }



      console.log(filtersApi)
      // Get filtered products
      DataLoader.get(filtersApi).then(function(response) {
        $scope.products = response.data;
        $scope.moreItems = true;
        $ionicLoading.hide();
      }, function(response) {
        console.log(response)
      });

  }

  // Load products on page load
  $scope.loadProducts();
  paged = 2;
  // Load more (infinite scroll)
  $scope.loadMore = function() {
    if( !$scope.moreItems ) {
      return;
    }

    if(!$scope.selectedFilters.style && !$scope.selectedFilters.type && !$scope.selectedFilters.category){
      var api = productsApi;
    }else{
      var api = filtersApi;
    }

    console.log(api)
    var pg = paged++;
    $log.log('loadMore ' + pg );
    $timeout(function() {
      DataLoader.get( api + '?page=' + pg ).then(function(response) {
        angular.forEach( response.data, function( value, key ) {
          $scope.products.push(value);
        });

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
        }
      }, function(response) {
        $scope.moreItems = false;
        $scope.lastPage = true;
        // $log.error(response);
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');

    }, 1000);
  }

  $scope.moreDataExists = function() {
    return $scope.moreItems;
  }


  $scope.doRefresh = function() {
    $timeout( function() {
      $scope.loadProducts();
      $scope.$broadcast('scroll.refreshComplete');

    }, 1000);

  };

})
