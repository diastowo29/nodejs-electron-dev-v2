// var Gpio = require('onoff').Gpio;

// var stepperEnable = new Gpio(13, 'out');
// var stepperDir = new Gpio(19, 'out');
// var stepperPulse = new Gpio(26, 'out');

// let stopBlinking = false;

// stepperDir.write(1, err => { // Asynchronous write
// 	console.log('stepperDir')
// 	if (err) {
// 		throw err;
// 	}
// 	stepperPulse.write(1, err => { // Asynchronous write
// 		console.log('stepperPulse')
// 		if (err) {
// 			throw err;
// 		}
// 		for (var i=0; i<1600; i++) {
// 			setTimeout(function(){
// 				stepperEnable.write(1, err => {
// 					console.log('stepperEnable1')
// 					if (err) {
// 						throw err;
// 					}
// 			    });
// 			}, 5000)
// 			setTimeout(function(){
// 				stepperEnable.write(0, err => {
// 					console.log('stepperEnable0')
// 					if (err) {
// 						throw err;
// 					}
// 			    });
// 			}, 5000)
// 		}
// 	});
// });


// const blinkLed = _ => {
//   if (stopBlinking) {
//     return stepperEnable.unexport();
//   }

//   stepperEnable.read((err, value) => { // Asynchronous read
//   	console.log('stepperEnable.read' + value)
//     if (err) {
//     	console.log(err)
//     	throw err;
//     }

//     stepperEnable.write(value ^ 1, err => { // Asynchronous write
//     	console.log('stepperEnable.write')
//       if (err) {
//       	console.log(err)
//         throw err;
//       }
//     });
//   });

//   setTimeout(blinkLed, 200);
// };

// blinkLed();

// setTimeout(_ => stopBlinking = true, 5000);

// var gpio = require("gpio");

// var stepperEnable = gpio.export(13, {
//    direction: gpio.DIRECTION.OUT,
//    interval: 200,
//    ready: function() {
//     console.log('stepperEnable ready')
//     setInterval(function(){
//       stepperEnable.set()
//     }, 500);
//     setTimeout(function(){
//       stepperEnable.set(0)
//     }, 1500);
//    }
// });

var speed        = 150; // RPM
var directionPin = 19; // Pin used for direction
var stepPin      = 26; // Pin used for stepping

console.log("Starting stepper-wiringpi - digital_ForwardBackward");

var stepperWiringPi = require("stepper-wiringpi");
var motor1 = stepperWiringPi.setupDigital(200, stepPin, directionPin);
var direction = stepperWiringPi.FORWARD;

console.log("Globals: FORWARD=%d, BACKWARD=%d", stepperWiringPi.FORWARD, stepperWiringPi.BACKWARD);

function changeDirection() {
  console.log("Changing direction from %d", direction);
  if (direction == stepperWiringPi.FORWARD) {
    direction = stepperWiringPi.BACKWARD;
    motor1.backward();
  } else {
    direction = stepperWiringPi.FORWARD;
    motor1.forward();
  }
  setTimeout(changeDirection.bind(this), 5000);
} // End of changeDirection

debugger;
motor1.setSpeed(speed);

changeDirection();

console.log("Starting to move ...")