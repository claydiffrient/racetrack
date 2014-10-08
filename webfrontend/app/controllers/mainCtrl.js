'use strict';

var app = angular.module('RaceTrack');

app.controller('MainCtrl', ['$scope', 'CoordService', function ($scope, CoordService) {


  $scope.map = {
      center: CoordService.getMapCoordinates(),
      zoom: 20
  };

  var path = [];

  var map = new google.maps.Map(document.getElementById("map-canvas"), $scope.map);

  // $scope.bikerLine = {
  //   path: [],
  //   stroke: {
  //     color: '#6060FB',
  //     weight: 3
  //   },
  //   editable: false,
  //   draggable: true,
  //   geodesic: true,
  //   visible: true,
  //   icons: [{
  //       icon: {
  //           path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
  //       },
  //       offset: '25px',
  //       repeat: '50px'
  //   }]
  // };

  var unwatch = CoordService.getData().$watch(function() {
    var coordinates = _.pluck(CoordService.getData(), 'coords');
    var ltlngCoords = coordinates.map(function (coord) {
      return {
        lat: coord.latitude,
        lng: coord.longitude
      };
    });
    path.push(_.last(ltlngCoords));  // Push the last into our line.

    // Make the polyline
    var polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#ff0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    //Add the polyline
    polyline.setMap(map);

    console.log(path);
  });
  //CoordService.getData().$bindTo($scope, 'bikerLine');


}]);