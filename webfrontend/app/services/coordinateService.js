var app = angular.module('RaceTrack');

app.factory('CoordService', ['$http', '$firebase', function ($http, $firebase) {

  var bikerFirebase = new Firebase("https://racetrack.firebaseio.com/bikerGPS");
  var droneFirebase = new Firebase("https://racetrack.firebaseio.com/droneGPS");

  var bikerSync = $firebase(bikerFirebase.limit(200));
  var droneSync = $firebase(droneFirebase.limit(100));

  //var bikerArray = bikerSync.$asArray();



  // Get the coordinates for the center of the map.
  var getMapCoordinates = function () {
    return {
      lat: 40.240808101408405,
      lng: -111.65780154067245
    }; //_.last(bikerArray);
  };

  // Get an array of coordinates of where the biker has been.
  // Used to make the line.
  var getBikerLine = function () {
    return _.pluck(bikerSync.$asArray(), 'coords');
  };

  var getData = function () {
    return bikerSync.$asArray();
  };

  var getDroneData = function () {
    return droneSync.$asArray();
  }


  return {
    getMapCoordinates: getMapCoordinates,
    getBikerLine: getBikerLine,
    getData: getData,
    getDroneData: getDroneData
  };

}]);