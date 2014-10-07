var Controller = require('node-pid-controller');
var ARDrone = require('ar-drone')
var client = ARDrone.createClient();

//var client = {
//  'front': function(value) {
//    console.log("Front:", value);
//  },
//
//  'back': function(value) {
//    console.log("Back:", value);
//  },
//
//  'clockwise': function(value) {
//    console.log("Clockwise:", value);
//  },
//
//  'counterClockwise': function(value) {
//    console.log("Counter-Clockwise:", value);
//  },
//
//  'on': function(_, cb) {
//    cb({'rotation': {'yaw': 0}});
//  }
//};

// state for managing the drone and biker locations, and a function to read out
// the delta
var State = {
  'headingCtl': new Controller(0.25, 0.01, 0.01), // k_p, k_i, k_d
  'rangeCtl': new Controller(0.25, 0.01, 0.01), // k_p, k_i, k_d
  //'climbCtl': new Controller(0.25, 0.01, 0.01); // k_p, k_i, k_d

  'drone': null,
  'biker': null,
  'heading': null,

  'updateDrone': function(data) {
    data = data.val();
    this.drone = data.coords;
    if (this.biker == null || this.heading == null) return;
    this.updated = true;
  },

  'updateBiker': function(data) {
    data = data.val();
    this.biker = data.coords;
    if (this.drone == null || this.heading == null) return;
    this.updated = true;
  },

  'updateHeading': function(data) {
    if (!data.demo) return;
    this.heading = data.demo.rotation.yaw;
    //console.log("updateHeading: ", this.heading);
    if (this.drone == null || this.biker == null) return;
    this.updated = true;
  },

  // returns heading, range (horizontal distance), and climb (vertical
  // distance)
  'delta': function() {
    var phi1 = this.biker.latitude * Math.PI / 180.0;
    var theta1 = this.biker.longitude * Math.PI / 180.0;
    var phi2 = this.drone.latitude * Math.PI / 180.0;
    var theta2 = this.drone.longitude * Math.PI / 180.0;
    var phi = (phi1 + phi2) / 2.0;
    var dphi = phi2 - phi1;
    var dtheta = theta2 - theta1;
    var dx = dtheta * 6378137.0 * Math.cos(phi) / Math.sqrt(1 - 0.00669437999014 * Math.pow(Math.sin(phi), 2));
    var dy = dphi * (180.0 / Math.PI) * (111132.954 - 559.822 * Math.cos(2 * phi) + 1.175 * Math.cos(4 * phi));
    console.log(dx, dy);
    return {
      'heading': Math.atan2(dy, dx),
      'range': Math.sqrt(dx * dx + dy * dy)//,
      //'climb': this.biker.altitude - this.drone.altitude,
    };
  },

  'update': function() {
    if (!this.updated) return;

    var heading = this.heading;
    var delta = this.delta();
    console.log("update: ", heading, delta);
    this.updated = false;

    // select turn rate and direction
    this.headingCtl.setTarget(delta.heading);
    var turnRate = this.headingCtl.update(heading);
    var turnDirection = 'clockwise';
    if (turnRate < 0) {
      turnDirection = 'counterClockwise';
      turnRate = -turnRate;
    }
    if (turnRate > 1) {
      turnRate = 1;
    }
    turnRate *= 0.05; // TODO: tuning value

    // select speed
    var forwardRange = delta.range * Math.cos(delta.heading - heading);
    this.rangeCtl.setTarget(forwardRange);
    var speed = this.rangeCtl.update(0);
    var direction = 'front';
    if (speed < 0) {
      direction = 'back';
      speed = -speed;
    }
    if (speed > 1) {
      speed = 1;
    }
    speed *= 0.2; // TODO: tuning value
    console.log(turnDirection, turnRate, direction, speed);

    // select climb rate
    //this.climbCtl.setTarget(climb);
    //var climbRate = this.climbCtl.update(0);
    //var climbDirection = 'up';
    //if (climbRate < 0) {
    //  climbDirection = 'down';
    //  climbRate = -climbRate;
    //}
    //if (climbRate > 1) {
    //  climbRate = 1;
    //}

    // alter drone's motion appropriately
    client[turnDirection](turnRate);
    client[direction](speed);
    //client[climbDirection](climbRate);
  }
};

// attach the GPS state to firebase
var Firebase = require('firebase');
var firebase = new Firebase("https://racetrack.firebaseio.com");
firebase.child("bikerGPS").on("child_added", State.updateBiker.bind(State))
firebase.child("droneGPS").on("child_added", State.updateDrone.bind(State))

// update from navdata
client.on('navdata', State.updateHeading.bind(State));

client.takeoff()

// try and update every so often (but only if there's something new to work
// with
var controlLoop = function() {
  State.update();
  setTimeout(controlLoop, 2000);
};

setTimeout(controlLoop, 200);
