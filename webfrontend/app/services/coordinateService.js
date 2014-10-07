var app = angular.module('RaceTrack');

app.factory('CoordService', ['$http', '$firebase', function ($http, $firebase) {

  var firebaseRef = new Firebase("https://racetrack.firebaseio.com/bikerGPS");

  var sync = $firebase(firebaseRef);

  // Get the coordinates for the center of the map.
  var getMapCoordinates = function () {
    return {
      latitude: 10,
      longitude: 10
    };
  };

  // Get an array of coordinates of where the biker has been.
  // Used to make the line.
  var getCoordinatesForLine = function () {

  };

  var getData = function () {
    return sync.$asObject();
  }


  return {
    getMapCoordinates: getMapCoordinates,
    getData: getData
  };

}]);