# node-powermate

A Node.js library for the [Griffin PowerMate](http://store.griffintechnology.com/laptops/powermate)

## Install

```
npm install node-powermate
```

## Usage

```javascript
var PowerMate = require('node-powermate');
var powermate = new PowerMate();
var powermater = new PowerMate(index); // optional index of PowerMate for multiple
```

### Events

Button down:

```javascript
powermate.on('buttonDown', callback);
```

Button up:

```javascript
powermate.on('buttonUp', callback);
```

Wheel turn:

```javascript
powermate.on('wheelTurn', callback(wheelDelta));
```

### Brightness

Brightness range is: 0 - 255

Set:

```javascript
powermate.setBrightness(brightness, [callback]);
```

Get:

```javascript
powermate.brightness(callback(brightness));
```

### Pulse Awake

Set:

```javascript
powermate.setPulseAwake(pulseAwake, [callback]);
```

Get:

```javascript
powermate.pulseAwake(callback(pulseAwake));
```

### Pulse Asleep

Set:

```javascript
powermate.setPulseAsleep(pulseAsleep, [callback]);
```

Get:

```javascript
powermate.pulseAsleep(callback(pulseAsleep));
```

### Pulse Speed

Pulse speed range: 0 - 511

Set:

```javascript
powermate.setPulseSpeed(pulseSpeed, [callback]);
```

Get:

```javascript
powermate.pulseSpeed(callback(pulseSpeed));
```

### Button State

Get:

```javascript
powermate.buttonState(callback(buttonState));
```

### Close

```javascript
powermate.close([callback]);
```

State:

```javascript
powermate.isClosed(); // returns: true | false
```

Permissions
-----
Depending on OS, you may get an error that looks something like

```
cannot open device with path 0001:0004:00
```

If this happens, it is likely because your user doesn't have permissions for the PowerMate device. In Linux (specifically Raspbian), creating the file /etc/udev/rules/95-powermate.rules and entering the following text:

```
SUBSYSTEM=="usb", ATTRS{idVendor}=="077d", ATTRS{idProduct}=="0410", SYMLINK+="powermate", MODE="660", GROUP="input"
```

will assign the PowerMate device to the "input" group, which the pi user belongs to. For other OSs, change the GROUP entry to a group that your user belongs to.

## License


Copyright (C) 2014 Sandeep Mistry <sandeep.mistry@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

