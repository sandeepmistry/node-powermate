var PowerMate = require('./powermate');

var powermate = new PowerMate();

powermate.on('buttonUp', function() {
  console.log('buttonUp');
});

powermate.on('buttonDown', function() {
  console.log('buttonDown');
});

powermate.on('wheelTurn', function(delta) {
  console.log('wheelTurn ' + delta);
});

setTimeout(function() {
  var desiredBrightness = 255;
  powermate.setBrightness(desiredBrightness, function() {
    powermate.brightness(function(brightness) {
      console.log('desiredBrightness = ' + desiredBrightness + ', brightness = ' + brightness);
    });
  });
}, 0);

setTimeout(function() {
  powermate.pulseAwake(function(pulseAwake) {
    console.log('pulseAwake = ' + pulseAwake);

    var desiredPulseAwake = !pulseAwake;
    powermate.setPulseAwake(desiredPulseAwake, function() {
      powermate.pulseAwake(function(pulseAwake) {
        console.log('desiredPulseAwake = ' + desiredPulseAwake + ', pulseAwake = ' + pulseAwake);
      });
    });
  });
}, 5000);

setTimeout(function() {
  powermate.pulseAsleep(function(pulseAsleep) {
    console.log('pulseAsleep = ' + pulseAsleep);

    var desiredPulseAsleep = !pulseAsleep;
    powermate.setPulseAsleep(desiredPulseAsleep, function() {
      powermate.pulseAsleep(function(pulseAsleep) {
        console.log('desiredPulseAsleep = ' + desiredPulseAsleep + ', pulseAsleep = ' + pulseAsleep);
      });
    });
  });
}, 10000);

setTimeout(function() {
  var desiredPulseSpeed = 0;
  powermate.setPulseSpeed(desiredPulseSpeed, function() {
    powermate.pulseSpeed(function(pulseSpeed) {
      console.log('desiredPulseSpeed = ' + desiredPulseSpeed + ', pulseSpeed = ' + pulseSpeed);
    });
  });
}, 15000);
