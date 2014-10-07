var app = angular.module('RaceTrack');

app.factory('CoordService', ['$http', '$firebase', function ($http, $firebase) {

  var bikerFirebase = new Firebase("https://racetrack.firebaseio.com/bikerGPS");
  var droneFirebase = new Firebase("https://racetrack.firebaseio.com/droneGPS");

  var bikerSync = $firebase(bikerFirebase.limit(100));
  var droneSync = $firebase(droneFirebase);

  //var bikerArray = bikerSync.$asArray();



  // Get the coordinates for the center of the map.
  var getMapCoordinates = function () {
    return {
      latitude: 40.24,
      longitude: -111.65
    }; //_.last(bikerArray);
  };

  // Get an array of coordinates of where the biker has been.
  // Used to make the line.
  var getBikerLine = function () {
    return _.pluck(bikerSync.$asArray(), 'coords');
  };

  var getData = function () {
    return bikerSync.$asArray();
  }


  return {
    getMapCoordinates: getMapCoordinates,
    getBikerLine: getBikerLine,
    getData: getData
  };

}]);