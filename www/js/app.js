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

  .state('app.intro', {
    url: "/intro",
    views: {
      'menuContent': {
        templateUrl: "templates/intro.html",
        controller: 'IntroCtrl'
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
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/intro');
});
