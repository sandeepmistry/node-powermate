node-powermate
==============

A node.js library for the [Griffin PowerMate](http://store.griffintechnology.com/laptops/powermate)

Install
-------

    npm install node-powermate

Usage
-----

    var PowerMate = require('node-powermate');
    var powermate = new PowerMate();

__Events__

Button down:

	powermate.on('buttonDown', callback);

Button up:

	powermate.on('buttonUp', callback);

Wheel turn:

	powermate.on('buttonUp', callback(wheelDelta));

__Brightness__

Brightness range is: 0 - 255

Set:

    powermate.setBrightness(brightness, [callback]);

Get:

	powermate.brightness(callback(brightness));

__Pulse Awake__

Set:

    powermate.setPulseAwake(pulseAwake, [callback]);

Get:

	powermate.pulseAwake(callback(pulseAwake));

__Pulse Asleep__

Set:

    powermate.setPulseAsleep(pulseAsleep, [callback]);

Get:

	powermate.pulseAsleep(callback(pulseAsleep));

__Pulse Speed__

Pulse speed range: 0 - 511

Set:

    powermate.setPulseSpeed(pulseSpeed, [callback]);

Get:

	powermate.pulseSpeed(callback(pulseSpeed));

__Button State__

Get:

	powermate.buttonState(callback(buttonState));

License
========

Copyright (C) 2012 Sandeep Mistry <sandeep.mistry@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

