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
//    	console.log('stepperEnable ready')
// 	var stepperDir = gpio.export(19, {
// 	   direction: gpio.DIRECTION.OUT,
// 	   interval: 200,
// 	   ready: function() {
// 	   	console.log('stepperDir ready')
// 		var stepperPulse = gpio.export(26, {
// 		   direction: gpio.DIRECTION.OUT,
// 		   interval: 200,
// 		   ready: function() {
// 		   	console.log('stepperPulse ready')

// 			stepperPulse.set(function() {
// 			   console.log('stepperPulse: ' + stepperPulse.value);
// 			   stepperDir.set(function() {
// 			   	console.log('stepperDir: ' + stepperDir.value);
// 			   	for (var i=0; i<1600; i++) {
// 			   		stepperEnable.set();
// 			   		setTimeout()
// 			   		stepperEnable.set(0);
// 			   	}
// 			   })
// 			});

// 		   }
// 		});
// 	   }
// 	});
//    }
// });

const {Board, Stepper} = require("johnny-five");
const board = new Board();

board.on("ready", () => {

  /**
   * In order to use the Stepper class, your board must be flashed with
   * either of the following:
   *
   * - AdvancedFirmata https://github.com/soundanalogous/AdvancedFirmata
   * - ConfigurableFirmata https://github.com/firmata/arduino/releases/tag/v2.6.2
   *
   */

  const stepper = new Stepper({
    type: Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: {
      step: 13,
      dir: 19
    }
  });

  // Set stepper to 180 RPM, counter-clockwise with acceleration and deceleration
  stepper.rpm(180).ccw().accel(1600).decel(1600);
  
  // Make 10 full revolutions
  stepper.step(2000, () => {

    console.log("Done moving CCW");

    // once first movement is done, make 10 revolutions clockwise at previously
    //      defined speed, accel, and decel by passing an object into stepper.step
    stepper.step({
      steps: 2000,
      direction: Stepper.DIRECTION.CW
    }, () => console.log("Done moving CW"));
  });
});