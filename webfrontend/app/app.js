'use strict';

var app = angular.module('RaceTrack', [
    'ngRoute',
    'google-maps',
    'firebase'
  ]);


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