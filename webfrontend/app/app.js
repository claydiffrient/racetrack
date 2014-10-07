'use strict';

console.log('got here');
var app = angular.module('RaceTrack', [
    'ngRoute',
    'google-maps'
  ]);

console.log(app);

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });