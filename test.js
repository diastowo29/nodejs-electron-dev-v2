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

// var speed        = 150; // RPM
// var directionPin = 19; // Pin used for direction
// var stepPin      = 26; // Pin used for stepping

// console.log("Starting stepper-wiringpi - digital_ForwardBackward");

// var stepperWiringPi = require("stepper-wiringpi");
// var motor1 = stepperWiringPi.setupDigital(200, stepPin, directionPin);
// var direction = stepperWiringPi.FORWARD;

// console.log("Globals: FORWARD=%d, BACKWARD=%d", stepperWiringPi.FORWARD, stepperWiringPi.BACKWARD);

// function changeDirection() {
//   console.log("Changing direction from %d", direction);
//   if (direction == stepperWiringPi.FORWARD) {
//     direction = stepperWiringPi.BACKWARD;
//     motor1.backward();
//   } else {
//     direction = stepperWiringPi.FORWARD;
//     motor1.forward();
//   }
//   setTimeout(changeDirection.bind(this), 5000);
// } // End of changeDirection

// debugger;
// motor1.setSpeed(speed);

// changeDirection();

// console.log("Starting to move ...")


/* JOHNNY FIVE */
// var five = require("johnny-five");
// var Raspi = require("raspi-io").RaspiIO;
// const {Stepper} = require("johnny-five");
// var board = new five.Board({
//   io: new Raspi()
// });


// board.on("ready", () => {

//   /**
//    * In order to use the Stepper class, your board must be flashed with
//    * either of the following:
//    *
//    * - AdvancedFirmata https://github.com/soundanalogous/AdvancedFirmata
//    * - ConfigurableFirmata https://github.com/firmata/arduino/releases/tag/v2.6.2
//    *
//    */

//   const stepper = new Stepper({
//     type: Stepper.TYPE.DRIVER,
//     stepsPerRev: 200,
//     pins: {
//       step: 26,
//       dir: 19
//     }
//   });

//   // Set stepper to 180 RPM, counter-clockwise with acceleration and deceleration
//   stepper.rpm(180).ccw().accel(1600).decel(1600);
  
//   // Make 10 full revolutions
//   stepper.step(2000, () => {

//     console.log("Done moving CCW");

//     // once first movement is done, make 10 revolutions clockwise at previously
//     //      defined speed, accel, and decel by passing an object into stepper.step
//     stepper.step({
//       steps: 2000,
//       direction: Stepper.DIRECTION.CW
//     }, () => console.log("Done moving CW"));
//   });
// });

var Gpio = require('onoff').Gpio;
var stepperEnable = new Gpio(13, 'out');
var stepperDir = new Gpio(19, 'out');
var stepperPulse = new Gpio(26, 'out');

stepperDir.writeSync(1);
stepperPulse.writeSync(1);
var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

function blinkLED() { //function to start blinking

  console.log('readpin')
  console.log(stepperEnable.readSync())
  if (stepperEnable.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    stepperEnable.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    stepperEnable.writeSync(0); //set pin state to 0 (turn LED off)
  }
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  stepperEnable.writeSync(0); // Turn LED off
  stepperEnable.unexport(); // Unexport GPIO to free resources
}

setTimeout(endBlink, 5000); //stop blinking after 5 seconds

process.on('SIGINT', endBlink);