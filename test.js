// var Gpio = require('onoff').Gpio;
// var pinEnable = new Gpio(13, 'out');
// var pinDir = new Gpio(19, 'out');
// var pinPulse = new Gpio(26, 'out');
// var ledPin = new Gpio(3, 'out');

// pinEnable.writeSync(1)
// pinDir.writeSync(1)
// var blinkInterval = setInterval(blinkLED, 50);

// function blinkLED() {
//   console.log('pinPulse: %s', pinPulse.readSync())
//   if (pinPulse.readSync() === 0) {
//     pinPulse.writeSync(1);
//     ledPin.writeSync(1);
//   } else {
//     pinPulse.writeSync(0);
//     ledPin.writeSync(0);
//   }
// }

// function endBlink() {
//   console.log('end process')
//   clearInterval(blinkInterval);
//   pinPulse.writeSync(0);
//   pinDir.writeSync(0);
//   pinEnable.writeSync(0);
//   ledPin.writeSync(0);
//   pinPulse.unexport();
//   pinDir.unexport();
//   pinEnable.unexport();
//   ledPin.unexport();
// }

// setTimeout(endBlink, 50000);

// process.on('SIGINT', endBlink);

const Gpio = require('pigpio').Gpio;

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6/34321;

const trigger = new Gpio(23, {mode: Gpio.OUTPUT});
const echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});

trigger.digitalWrite(0); // Make sure trigger is low

const watchHCSR04 = () => {
  let startTick;

  echo.on('alert', (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      console.log(diff / 2 / MICROSECDONDS_PER_CM);
    }
  });
};

watchHCSR04();

// Trigger a distance measurement once per second
setInterval(() => {
  trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 1000);