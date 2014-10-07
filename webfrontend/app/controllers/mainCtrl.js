'use strict';

var app = angular.module('RaceTrack');

app.controller('MainCtrl', ['$scope', 'CoordService', function ($scope, CoordService) {



  $scope.map = {
      center: CoordService.getMapCoordinates(),
      zoom: 8
  };

  $scope.data = CoordService.getData();
  console.log($scope.data);

  }]);