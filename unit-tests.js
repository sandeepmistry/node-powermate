var should = require('should');
var mockery = require('mockery');

describe('PowerMate', function() {
  var POWERMATE_SRC_PATH = './powermate.js';

  var VENDOR_ID = 0x077d;
  var PRODUCT_ID = 0x0410;

  var FEATURE_REPORT_ID = 0;
  var FEATURE_REPORT_LENGTH = 9;

  var MOCK_HID_DEVICE_1_PATH = 'mock-path-1';
  var MOCK_HID_DEVICE_2_PATH = 'mock-path-2';

  var MOCK_HID_DEVICE_1 = {
    path: MOCK_HID_DEVICE_1_PATH
  };

  var MOCK_HID_DEVICE_2 = {
    path: MOCK_HID_DEVICE_2_PATH
  };

  var PowerMate;
  var mockHIDdevices;
  var sentFeatureReport;
  var recvFeatureReport;
  var readCallback;
  var closed;

  var mockHIDdevice1 = {
    sendFeatureReport: function(featureReport) {
      sentFeatureReport = featureReport;
    },

    getFeatureReport: function(id, length) {
      return ((id === FEATURE_REPORT_ID ) && (length === FEATURE_REPORT_LENGTH)) ? recvFeatureReport : null;
    },

    read: function(callback) {
      readCallback = callback;
    },

    close: function() {
      closed = true;
    }
  };

  var mockHIDdevice2 = {
    sendFeatureReport: function(featureReport) {
      sentFeatureReport = featureReport;
    },

    getFeatureReport: function(id, length) {
      return ((id === FEATURE_REPORT_ID ) && (length === FEATURE_REPORT_LENGTH)) ? recvFeatureReport : null;
    },

    read: function(callback) {
      readCallback = callback;
    },

    close: function() {

    }
  };

  var mockHID = {
    devices: function(vendorId, productId) {
      return ((vendorId === VENDOR_ID) && (productId === PRODUCT_ID)) ? mockHIDdevices : null;
    },

    HID: function(path) {
      var hidDevice = null;

      if (path === MOCK_HID_DEVICE_1_PATH) {
        hidDevice = mockHIDdevice1;
      } else if (path === MOCK_HID_DEVICE_2_PATH) {
        hidDevice = mockHIDdevice2;
      }

      return hidDevice;
    }
  };

  beforeEach(function() {
    mockery.registerAllowable(POWERMATE_SRC_PATH);
    mockery.enable();

    mockery.registerMock('node-hid', mockHID);

    PowerMate = require(POWERMATE_SRC_PATH);
  });

  afterEach(function() {
    mockery.deregisterAllowable(POWERMATE_SRC_PATH);
    mockery.disable();

    mockery.deregisterMock('node-hid');

    PowerMate = null;
    mockHIDdevices = null;
  });

  describe('#PowerMate', function() {

    it('should throw an error when there are no PowerMate HID devices', function() {
      mockHIDdevices = [];

      (function(){
        new PowerMate();
      }).should.throwError('No PowerMate\'s could be found');
    });

    it('should not throw an error when there are PowerMate HID devices', function() {
      mockHIDdevices = [MOCK_HID_DEVICE_1];

      new PowerMate();
    });

    it('should open first HID device path when no index specified', function() {
      mockHIDdevices = [MOCK_HID_DEVICE_1];

      var powermate = new PowerMate();
      powermate._hidDevice.should.equal(mockHIDdevice1);
    });

    it('should throw an error when there are no PowerMate HID devices at index', function() {
      mockHIDdevices = [MOCK_HID_DEVICE_1];

      (function(){
        new PowerMate(1);
      }).should.throwError('No PowerMate found at index 1');
    });

    it('should open index HID device path when index specified', function() {
      mockHIDdevices = [MOCK_HID_DEVICE_1, MOCK_HID_DEVICE_2];

      var powermate = new PowerMate(1);
      powermate._hidDevice.should.equal(mockHIDdevice2);
    });

    it('should call read with callback', function() {
      mockHIDdevices = [MOCK_HID_DEVICE_1];

      var powermate = new PowerMate();
      readCallback.should.be.a('function');
    });

    var powermate;

    var setupPowerMate = function() {
      mockHIDdevices = [MOCK_HID_DEVICE_1];

      powermate = new PowerMate();
    };

    var teardownPowerMate = function() {
      powermate = null;
    };

    describe('#PowerMate.setBrightness', function() {
      beforeEach(setupPowerMate);
      afterEach(teardownPowerMate);

      it('should send set brightness 0 feature report', function() {
        powermate.setBrightness(0);

        sentFeatureReport.should.eql([FEATURE_REPORT_ID, 0x41, 1, 1, 0, 0, 0, 0, 0]);
      });

      it('should send set brightness 255 feature report', function() {
        powermate.setBrightness(255);

        sentFeatureReport.should.eql([FEATURE_REPORT_ID, 0x41, 1, 1, 0, 255, 0, 0, 0]);
      });

      it('should call back', function(done) {
        powermate.setBrightness(255, function() {
          done();
        });
      });

      it('should throw an Error when trying to setBrightness on a closed powermate', function(done){
        powermate.close();
        try {
          powermate.setBrightness(255, function() {

          });
        } catch (err) {
          done();
        }
      });
    });

    describe('#PowerMate.setPulseAsleep', function() {
      beforeEach(setupPowerMate);
      afterEach(teardownPowerMate);

      it('false, should send set pulse asleep off feature report', function() {
        powermate.setPulseAsleep(false);

        sentFeatureReport.should.eql([FEATURE_REPORT_ID, 0x41, 1, 2, 0, 0, 0, 0, 0]);
      });

      it('true, should send set pulse asleep on feature report', function() {
        powermate.setPulseAsleep(true);

        sentFeatureReport.should.eql([FEATURE_REPORT_ID, 0x41, 1, 2, 0, 1, 0, 0, 0]);
      });

      it('should call back', function(done) {
        powermate.setPulseAsleep(true, function() {
          done();
        });
      });

      it('should throw an Error when trying to setPulseAsleep on a closed powermate', function(done){
        powermate.close();
        try {
          powermate.setPulseAsleep(true, function() {

          });
        } catch (err) {
          done();
        }
      });
    });

    describe('#PowerMate.setPulseAwake', function() {
      beforeEach(setupPowerMate);
      afterEach(teardownPowerMate);

      it('false, should send set pulse awake off feature report', function() {
        powermate.setPulseAwake(false);

        sentFeatureReport.should.eql([FEATURE_REPORT_ID, 0x41, 1, 3, 0, 0, 0, 0, 0]);
      });

      it('true, should send set pulse awake on feature report', function() {
        powermate.setPulseAwake(true);

        sentFeatureReport.should.eql([FEATURE_REPORT_ID, 0x41, 1, 3, 0, 1, 0, 0, 0]);
      });

      it('should call back', function(done) {
        powermate.setPulseAwake(true, function() {
          done();
        });
      });
    });

    describe('#PowerMate.setPulseSpeed', function() {
      beforeEach(setupPowerMate);
      afterEach(teardownPowerMate);

      it('0, should send set pulse speed 0 feature report', function() {
        powermate.setPulseSpeed(0);

        sentFeatureReport.should.eql([FEATURE_REPORT_ID, 0x41, 1, 4, 0, 0, 254, 0, 0]);
      });

      it('254, should send set pulse speed 254 feature report', function() {
        powermate.setPulseSpeed(254);

        sentFeatureReport.should.eql([FEATURE_REPORT_ID, 0x41, 1, 4, 0, 0, 0, 0, 0]);
      });

      it('255, should send set pulse speed 255 feature report', function() {
        powermate.setPulseSpeed(255);

        sentFeatureReport.should.eql([FEATURE_REPORT_ID, 0x41, 1, 4, 0, 1, 0, 0, 0]);
      });

      it('256, should send set pulse speed 256 feature report', function() {
        powermate.setPulseSpeed(256);

        sentFeatureReport.should.eql([FEATURE_REPORT_ID, 0x41, 1, 4, 0, 2, 1, 0, 0]);
      });

      it('510, should send set pulse speed 510 feature report', function() {
        powermate.setPulseSpeed(510);

        sentFeatureReport.should.eql([FEATURE_REPORT_ID, 0x41, 1, 4, 0, 2, 255, 0, 0]);
      });

      it('should call back', function(done) {
        powermate.setPulseSpeed(true, function() {
          done();
        });
      });
    });

    describe('#PowerMate.buttonState', function() {
      beforeEach(setupPowerMate);
      afterEach(teardownPowerMate);

      it('should call back', function(done) {
        recvFeatureReport = [];

        powermate.buttonState(function() {
          done();
        });
      });

      it('should call back call back with 0 when up', function(done) {
        recvFeatureReport = [0, 0, 0, 0, 0, 0];

        powermate.buttonState(function(buttonState) {
          buttonState.should.eql(0);
          done();
        });
      });

      it('should call back call back with 1 when down', function(done) {
        recvFeatureReport = [1, 0, 0, 0, 0, 0];

        powermate.buttonState(function(buttonState) {
          buttonState.should.eql(1);
          done();
        });
      });
    });

    describe('#PowerMate.brightness', function() {
      beforeEach(setupPowerMate);
      afterEach(teardownPowerMate);

      it('should call back', function(done) {
        recvFeatureReport = [];

        powermate.brightness(function() {
          done();
        });
      });

      it('should call back call back with 0 when 0', function(done) {
        recvFeatureReport = [0, 0, 0, 0, 0, 0];

        powermate.brightness(function(brightness) {
          brightness.should.eql(0);
          done();
        });
      });

      it('should call back call back with 255 when 255', function(done) {
        recvFeatureReport = [0, 0, 0, 255, 0, 0];

        powermate.brightness(function(brightness) {
          brightness.should.eql(255);
          done();
        });
      });
    });

    describe('#PowerMate.pulseAwake', function() {
      beforeEach(setupPowerMate);
      afterEach(teardownPowerMate);

      it('should call back', function(done) {
        recvFeatureReport = [];

        powermate.pulseAwake(function() {
          done();
        });
      });

      it('should call back call back with false when off', function(done) {
        recvFeatureReport = [0, 0, 0, 0, 0, 0];

        powermate.pulseAwake(function(pulseAwake) {
          pulseAwake.should.eql(false);
          done();
        });
      });

      it('should call back call back with true when on', function(done) {
        recvFeatureReport = [0, 0, 0, 0, 1, 0];

        powermate.pulseAwake(function(pulseAwake) {
          pulseAwake.should.eql(true);
          done();
        });
      });
    });

    describe('#PowerMate.pulseAsleep', function() {
      beforeEach(setupPowerMate);
      afterEach(teardownPowerMate);

      it('should call back', function(done) {
        recvFeatureReport = [];

        powermate.pulseAsleep(function() {
          done();
        });
      });

      it('should call back call back with false when off', function(done) {
        recvFeatureReport = [0, 0, 0, 0, 0, 0];

        powermate.pulseAsleep(function(pulseAsleep) {
          pulseAsleep.should.eql(false);
          done();
        });
      });

      it('should call back call back with true when on', function(done) {
        recvFeatureReport = [0, 0, 0, 0, 4, 0];

        powermate.pulseAsleep(function(pulseAsleep) {
          pulseAsleep.should.eql(true);
          done();
        });
      });
    });

    describe('#PowerMate.pulseSpeed', function() {
      beforeEach(setupPowerMate);
      afterEach(teardownPowerMate);

      it('should call back', function(done) {
        recvFeatureReport = [];

        powermate.pulseSpeed(function() {
          done();
        });
      });

      it('should call back with 255 when pulse normal', function(done) {
        recvFeatureReport = [0, 0, 0, 0, 0x10, 0];

        powermate.pulseSpeed(function(pulseSpeed) {
          pulseSpeed.should.eql(255);
          done();
        });
      });

      it('should call back with 256 when pulse fast', function(done) {
        recvFeatureReport = [0, 0, 0, 0, 0x20, 1];

        powermate.pulseSpeed(function(pulseSpeed) {
          pulseSpeed.should.eql(256);
          done();
        });
      });

      it('should call back with 254 when pulse slow', function(done) {
        recvFeatureReport = [0, 0, 0, 0, 0x00, 0];

        powermate.pulseSpeed(function(pulseSpeed) {
          pulseSpeed.should.eql(254);
          done();
        });
      });
    });

    describe('#PowerMate.read', function() {
      beforeEach(setupPowerMate);
      afterEach(teardownPowerMate);

      it('should throw error on read error', function() {
        (function(){
          readCallback(new Error('read error'));
        }).should.throwError('read error');
      });

      it('should call read after read', function() {
        var oldReadCallback = readCallback;
        readCallback = null;

        oldReadCallback(null, null);

        readCallback.should.be.a('function');
      });

      it('should fire buttonDown event on button down read data', function(done) {
        powermate.on('buttonDown', function() {
          powermate._buttonState.should.equal(1);
          done();
        });

        readCallback(null, [1, 0]);
      });

      it('should fire buttonUp event on button up read data ', function(done) {
        powermate._buttonState = 1;

        powermate.on('buttonUp', function() {
          powermate._buttonState.should.equal(0);
          done();
        });

        readCallback(null, [0, 0]);
      });

      it('should fire wheelTurn event on wheen turn read data', function(done) {

        powermate.on('wheelTurn', function() {
          done();
        });

        readCallback(null, [0, 1]);
      });

      it('should fire wheelTurn event on wheen turn read data with positive arg', function(done) {

        powermate.on('wheelTurn', function(wheelDelta) {
          wheelDelta.should.eql(127);
          done();
        });

        readCallback(null, [0, 127]);
      });

      it('should fire wheelTurn event on wheen turn read data with negative arg', function(done) {

        powermate.on('wheelTurn', function(wheelDelta) {
          wheelDelta.should.eql(-127);
          done();
        });

        readCallback(null, [0, 0x81]);
      });
    });

    describe('#PowerMate.close', function() {
      beforeEach(setupPowerMate);
      afterEach(teardownPowerMate);

      it('should return false for isClosed when not closed', function(done) {
        powermate.isClosed().should.eql(false);

        done();
      });

      it('should call HID close', function(done) {
        powermate.close();

        closed.should.eql(true);

        done();
      });

      it('should callback', function(done) {
        powermate.close(function() {
          done();
        });
      });

      it('should return true for isClosed when closed', function(done) {
        powermate.close(function() {
          powermate.isClosed().should.eql(true);

          done();
        });
      });
    });
  });
});