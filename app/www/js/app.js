// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angular.filter'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

  });
})

.filter('cards',function(){
  return function(input){
    if(input == 1) return 'A';
    if(input == 11) return 'J';
    if(input == 12) return 'Q';
    if(input == 13) return 'K';
    return input;
  }
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('game', {
    url: '/game',
    templateUrl: 'templates/board.template.html',
    controller: 'GameCtrl'
  });

  $urlRouterProvider.otherwise('/game');

});