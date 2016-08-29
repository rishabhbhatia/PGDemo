angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // $ionicConfigProvider.tabs.position('bottom');

    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })

    $stateProvider
    .state('tabs', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

     .state('tabs.home', {
      url: '/home',
      views: {
        'home-tab': {
          templateUrl: 'templates/home.html',
          controller: 'PartyController'
        }
      }
    })

     .state('tabs.messages', {
      url: '/messages',
      views: {
        'messages-tab': {
          templateUrl: 'templates/messages.html',
          controller: 'MessagesController'
        }
      }
    })

     .state('tabs.profile', {
      url: '/profile',
      views: {
        'profile-tab': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileController'
        }
      }
    })

    // $urlRouterProvider.otherwise('/tab/home');
    $urlRouterProvider.otherwise('/login');
})

.controller("LoginController", function($scope, $http, $state,
 $ionicPopup, LoginService) {
  $scope.data = {};

  $scope.login = function() {
    if($scope.data.username === undefined ||
     $scope.data.password === undefined) 
    {
      var alertPopup = $ionicPopup.alert({
                title: 'Invalid input',
                template: 'Please enter your credentials!'
            });
      return;
    }
  console.log("Please log me in. I'm "+$scope.data.username+
    " & my password is: "+$scope.data.password);

      LoginService.loginUser($scope.data.username, $scope.data.password).
      success(function(data) {
            $state.go('tabs.home');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });

      }

})


.controller("PartyController", [ "$scope" , "$http", "$state" ,
  function($scope, $http, $state) {

      $http.get("js/data.json").success(function(data) {
        $scope.parties = data;

      $scope.goingToEvent = function(eventIndex) {
      console.log("I'm going to event at: "+eventIndex);
      };

      $scope.commentOnEvent = function(eventIndex) {
      console.log("I want to comment on event at: "+eventIndex);
      };

      $scope.showPeopleGoingToEvent = function(eventIndex) {
      console.log("Show me people going to event at: "+eventIndex);
      };

      $scope.notGoingToEvent = function(eventIndex) {
      console.log("I'm not going to event at: "+eventIndex);
      };

    });

}])

.controller("MessagesController", [ "$scope" , "$http", "$state" ,
  function($scope, $http, $state) {

      $http.get("js/data.json").success(function(data) {
        $scope.messages = data;

    });

}])

.controller("ProfileController", [ "$scope" , "$http", "$state" ,
  function($scope, $http, $state) {

      $http.get("js/data.json").success(function(data) {
        $scope.user = data[0];
        console.log("hello to: "+$scope.user.name);

    });

}])

.service('LoginService', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
            if (name === 'user' && pw === 'pass') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})