'use strict';

var app = angular.module('RaceTrack');

app.controller('MainCtrl', ['$scope', 'CoordService', function ($scope, CoordService) {


  $scope.map = {
      center: CoordService.getMapCoordinates(),
      zoom: 20
  };

  var path = [];
  var bikerPos;
  var dronePos;
  var polyline;

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

    if (bikerPos) {
      bikerPos.setMap(null);
      bikerPos = null;
    }

    if (polyline) {
      polyline.setMap(null);
      polyline = null;
    }

    var coordinates = _.pluck(CoordService.getData(), 'coords');
    var ltlngCoords = coordinates.map(function (coord) {
      return {
        lat: coord.latitude,
        lng: coord.longitude
      };
    });

    var latestCoord = _.last(ltlngCoords)

    path.push(latestCoord);  // Push the last into our line.

    // Make the polyline
    polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#ff0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    //Add the polyline
    polyline.setMap(map);



    //Make a circle to indicate the current position
    bikerPos = new google.maps.Circle({
      strokeColor: '#0000ff',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: '#0000ff',
      fillOpacity: 1,
      map: map,
      center: latestCoord,
      radius: 1
    });

  });

  var unwatchDrone = CoordService.getDroneData().$watch(function (){

    if (dronePos) {
      dronePos.setMap(null);
      dronePos = null;
    }

    var coordinates = _.pluck(CoordService.getDroneData(), 'coords');
    var ltlngCoords = coordinates.map(function (coord) {
      return {
        lat: coord.latitude,
        lng: coord.longitude
      };
    });

    var latestCoord = _.last(ltlngCoords); // var latestCoord = ltlngCoords[35];

    console.log(latestCoord);
    dronePos = new google.maps.Circle({
      strokeColor: '#00ff00',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: '#00ff00',
      fillOpacity: 1,
      map: map,
      center: latestCoord,
      radius: 1
    });
    console.log(dronePos);
  });
  //CoordService.getData().$bindTo($scope, 'bikerLine');


}]);