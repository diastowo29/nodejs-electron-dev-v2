var Gpio = require('onoff').Gpio;
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


var triggerPin = new Gpio(23, 'out');
var echoPin = new Gpio(24, 'in');

setInterval(function () {
  triggerPin.writeSync(0)
  setTimeout(function(){
    triggerPin.writeSync(1)
    setTimeout(function(){
      triggerPin.writeSync(0)
    }, 10)
  }, 2)
  echoPin.watch(function (err, value) {
    if (err) {
      console.error('There was an error', err);
      return;
    }
    console.log(value)
  });
}, 250)
