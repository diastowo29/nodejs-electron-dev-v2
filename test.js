var Gpio = require('onoff').Gpio;

var stepperEnable = new Gpio(13, 'out');
var stepperDir = new Gpio(19, 'out');
var stepperPulse = new Gpio(26, 'out');

var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

function blinkLED() {
  // if (stepperEnable.readSync() === 0) {
    stepperEnable.writeSync(1);
    stepperDir.writeSync(1);
    stepperPulse.writeSync(1);
  // } else {
  //   stepperDir.writeSync(1);
  //   stepperPulse.writeSync(1);
  // }
}

function endBlink() {
	turnOff()
}

function turnOff () {
	stepperPulse.writeSync(0)
	stepperDir.writeSync(0)
	stepperEnable.writeSync(0)

	stepperPulse.unexport()
	stepperDir.unexport()
	stepperEnable.unexport()
}

setTimeout(endBlink, 5000); //stop blinking after 5 seconds