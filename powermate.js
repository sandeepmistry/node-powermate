var HID = require('node-hid');

var util = require('util');
var events = require('events');

var VENDOR_ID = 0x077d;
var PRODUCT_ID = 0x0410;

var REPORT_ID = 0;
var REPORT_LENGTH = 9;

var SET_STATIC_BRIGHTNESS = 0x01;
var SET_PULSE_ASLEEP = 0x02;
var SET_PULSE_AWAKE = 0x03;
var SET_PULSE_MODE = 0x04;

function PowerMate(index) {
  if (typeof(index) == "object") {
    if (index['hidDriver']) {
      HID.setDriverType(index['hidDriver']);
    }
    index = index['index'];
  }

  var powerMateHIDdevices = HID.devices(VENDOR_ID, PRODUCT_ID);

  if (powerMateHIDdevices.length === 0) {
    throw new Error('No PowerMate\'s could be found');
  }

  if (index === undefined) {
    index = 0;
  }

  if (powerMateHIDdevices[index] === undefined) {
    throw new Error('No PowerMate found at index ' + index);
  }

  var powerMateHIDdevice = powerMateHIDdevices[index];

  this._hidDevice = new HID.HID(powerMateHIDdevice.path);
  this._buttonState = 0;
  this._closed = false;

  this._parseRead();
}

util.inherits(PowerMate, events.EventEmitter);

PowerMate.prototype._sendCommand = function(/* command [, args ...]*/) {
  if (this._closed) {
    throw new Error("PowerMate device has been closed");
  }

  var command = arguments[0];
  var featureReport = [REPORT_ID, 0x41, 1, command, 0, 0, 0, 0, 0];

  for (var i = 1; i < arguments.length; i++) {
    featureReport[i + 4] = arguments[i];
  }

  this._hidDevice.sendFeatureReport(featureReport);
};

PowerMate.prototype._readFeatureReport = function(callback) {
  if (this._closed) {
    throw new Error("PowerMate device has been closed");
  }

  callback(this._hidDevice.getFeatureReport(REPORT_ID, REPORT_LENGTH));
};

PowerMate.prototype.setBrightness = function(brightness, callback) {
  this._sendCommand(SET_STATIC_BRIGHTNESS, brightness);

  if(callback) {
    callback();
  }
};

PowerMate.prototype.setPulseAsleep = function(pulseAsleep, callback) {
  this._sendCommand(SET_PULSE_ASLEEP, pulseAsleep ? 1 : 0);

  if(callback) {
    callback();
  }
};

PowerMate.prototype.setPulseAwake = function(pulseAwake, callback) {
  this._sendCommand(SET_PULSE_AWAKE, pulseAwake ? 1 : 0);

  if(callback) {
    callback();
  }
};

PowerMate.prototype.setPulseSpeed = function(pulseSpeed, callback) {
  var pulseTable;

  if (pulseSpeed < 255) {
    pulseTable = 0;
    pulseSpeed = (254 - pulseSpeed);
  } else if (pulseSpeed === 255) {
    pulseTable = 1;
    pulseSpeed = 0;
  } else {
    pulseTable = 2;
    pulseSpeed -= 255;
  }

  this._sendCommand(SET_PULSE_MODE, pulseTable, pulseSpeed);

  if(callback) {
    callback();
  }
};

PowerMate.prototype.buttonState = function(callback) {
  var _this = this;

  this._readFeatureReport(function(response) {
    // Byte 0: Button
    var buttonState = response[0];

    _this._buttonState = buttonState;

    if(callback) {
      callback(buttonState);
    }
  });
};

PowerMate.prototype.brightness = function(callback) {
  this._readFeatureReport(function(response) {
    // Byte 3: LED brightness
    var ledBrightness = response[3];

    if(callback) {
      callback(ledBrightness);
    }
  });
};

PowerMate.prototype.pulseAwake = function(callback) {
  this._readFeatureReport(function(response) {
    // Byte 4: LED status
    var ledStatus = response[4];
    var pulseAwake = (ledStatus & 0x1) ? true : false;

    if(callback) {
      callback(pulseAwake);
    }
  });
};

PowerMate.prototype.pulseAsleep = function(callback) {
  this._readFeatureReport(function(response) {
    // Byte 4: LED status
    var ledStatus = response[4];
    var pulseAsleep = (ledStatus & 0x4) ? true : false;

    if(callback) {
      callback(pulseAsleep);
    }
  });
};

PowerMate.prototype.pulseSpeed = function(callback) {
  this._readFeatureReport(function(response) {
    // Byte 4: LED status
    // Byte 5: LED multiplier (for pulsing LED)
    var ledStatus = response[4];
    var pulseSpeed = response[5];

    if(ledStatus & 0x20) {
      // pulse fast
      pulseSpeed += 255;
    } else if(ledStatus & 0x10) {
      // pulse normal
      pulseSpeed = 255;
    } else {
      pulseSpeed = (254 - pulseSpeed);
    }

    if(callback) {
      callback(pulseSpeed);
    }
  });
};

PowerMate.prototype._parseRead = function(error, data) {
  if (this._closed) {
    return;
  } else if (error) {
    if (error.message == "could not read from HID device") {
      process.nextTick(function(){
        this.close();
      }.bind(this));
      this.emit('disconnected');
    } else {
      throw error;
    }
  } else if (data) {
    var buttonState = data[0];
    if (buttonState !== this._buttonState) {
      this._buttonState = buttonState;

      this.emit(buttonState ? 'buttonDown' : 'buttonUp');
    }

    var wheelDelta = data[1];
    if (wheelDelta) {
      if (wheelDelta & 0x80) {
        wheelDelta -= 256;
      }

      this.emit('wheelTurn', wheelDelta);
    }
  }

  this._hidDevice.read(this._parseRead.bind(this));
};

PowerMate.prototype.close = function(callback) {
  this._closed = true;
  this._hidDevice.close();

  if (callback) {
    callback();
  }
};

PowerMate.prototype.isClosed = function() {
  return this._closed;
};

module.exports = PowerMate;
