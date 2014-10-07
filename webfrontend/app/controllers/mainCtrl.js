'use strict';

var app = angular.module('RaceTrack');

app.controller('MainCtrl', ['$scope', function ($scope) {


    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 8
    };

  }]);