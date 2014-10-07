'use strict';

var app = angular.module('RaceTrack');

app.controller('MainCtrl', ['$scope', 'CoordService', function ($scope, CoordService) {

  $scope.bikerLine = {};
  $scope.bikerLine.path = [{
    latitude: 40.24102703671923,
    longitude: -111.65750456984306
  },{
    latitude: 40.24102577071256,
    longitude: -111.65742266108956
  }];


  $scope.map = {
      center: CoordService.getMapCoordinates(),
      zoom: 15
  };

  $scope.bikerLine = {
    path: [],
    stroke: {
      color: '#6060FB',
      weight: 3
    },
    editable: false,
    draggable: true,
    geodesic: true,
    visible: true,
    icons: [{
        icon: {
            path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
        },
        offset: '25px',
        repeat: '50px'
    }]
  };

  var unwatch = CoordService.getData().$watch(function() {
    var coordinates = _.pluck(CoordService.getData(), 'coords');
    $scope.bikerLine.path.push(_.last(coordinates));  // Push the last into our line.
    console.log($scope.bikerLine.path);
  });
  //CoordService.getData().$bindTo($scope, 'bikerLine');


}]);