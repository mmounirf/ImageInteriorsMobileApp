var ImageInteriorsApp = angular.module('ImageInteriorsApp', ['ionic', 'ionic.service.core', 'ngCordova', 'angular-cache', 'ionicLazyLoad'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

ImageInteriorsApp.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, CacheFactoryProvider) {

  angular.extend(CacheFactoryProvider.defaults, {
    'storageMode': 'localStorage',
    'capacity': 10,
    'maxAge': 10800000,
    'deleteOnExpire': 'aggressive',
    'recycleFreq': 10000
  })

  // Native scrolling
  if( ionic.Platform.isAndroid() ) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }

  $stateProvider

  // sets up our default state, all views are loaded through here
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.signin', {
    url: "/signin",
    views: {
      'menuContent': {
        templateUrl: "templates/signin.html",
        controller: 'SigninCtrl'
      }
    }
  })

  // this is the first sub view, notice menuContent under 'views', which is loaded through menu.html
  .state('app.products', {
    url: "/products",
    views: {
      'menuContent': {
        templateUrl: "templates/products.html",
        controller: 'ProductsCtrl'
      }
    }
  })

  .state('app.product', {
    url: "/products/:productId",
    views: {
      'menuContent': {
        templateUrl: "templates/product.html",
        controller: 'ProductCtrl'
      }
    }
  })

  .state('app.showrooms', {
    url: "/showrooms",
    views: {
      'menuContent': {
        templateUrl: "templates/showrooms.html",
        controller: 'ShowroomsCtrl'
      }
    }
  })

  .state('app.showroom', {
    url: "/showrooms/:showroomId",
    views: {
      'menuContent': {
        templateUrl: "templates/showroom.html",
        controller: 'ShowroomCtrl'
      }
    }
  })

  .state('app.catalogs', {
    url: "/catalogs",
    views: {
      'menuContent': {
        templateUrl: "templates/catalogs.html",
        controller: 'CatalogsCtrl'
      }
    }
  })

  .state('app.catalog', {
    url: "/catalogs/:catalogId",
    views: {
      'menuContent': {
        templateUrl: "templates/catalog.html",
        controller: 'CatalogCtrl'
      }
    }
  })

  .state('app.designers', {
    url: "/designers",
    views: {
      'menuContent': {
        templateUrl: "templates/designers.html",
        controller: 'DesignersCtrl'
      }
    }
  })

  .state('app.designer', {
    url: "/designers/:designerId",
    views: {
      'menuContent': {
        templateUrl: "templates/designer.html",
        controller: 'DesignerCtrl'
      }
    }
  })

  .state('app.houses', {
    url: "/houses",
    views: {
      'menuContent': {
        templateUrl: "templates/houses.html",
        controller: 'HousesCtrl'
      }
    }
  })

  .state('app.house', {
    url: "/houses/:houseId",
    views: {
      'menuContent': {
        templateUrl: "templates/house.html",
        controller: 'HouseCtrl'
      }
    }
  })

  .state('app.articles', {
    url: "/articles",
    views: {
      'menuContent': {
        templateUrl: "templates/articles.html",
        controller: 'ArticlesCtrl'
      }
    }
  })

  .state('app.article', {
    url: "/articles/:articleId",
    views: {
      'menuContent': {
        templateUrl: "templates/article.html",
        controller: 'ArticleCtrl'
      }
    }
  })

  .state('app.favorites', {
    url: "/favorites",
    views: {
      'menuContent': {
        templateUrl: "templates/favorites.html",
        controller: 'FavoritesCtrl'
      }
    }
  })

  .state('app.signup', {
    url: "/signup",
    views: {
      'menuContent': {
        templateUrl: "templates/signup.html",
        controller: 'SignupCtrl'
      }
    }
  })

  .state('app.envouges', {
    url: "/envouges",
    views: {
      'menuContent': {
        templateUrl: "templates/envouges.html",
        controller: 'EnvougesCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/signin');
});
