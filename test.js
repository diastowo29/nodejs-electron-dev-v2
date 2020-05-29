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
var five = require("johnny-five");
const {Board, Stepper, Motor} = require("johnny-five");
var temporal = require("temporal");
var Raspi = require("raspi-io").RaspiIO;
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
  const motor = new Motor({
    pins: {
      pwm: 13,
      dir: 19,
      cdir: 26
    }
  });

  board.repl.inject({
    motor
  });

  motor.on("start", () => {
    console.log(`start: ${Date.now()}`);
  });

  motor.on("stop", () => {
    console.log(`automated stop on timer: ${Date.now()}`);
  });

  motor.on("brake", () => {
    console.log(`automated brake on timer: ${Date.now()}`);
  });

  motor.on("forward", () => {
    console.log(`forward: ${Date.now()}`);

    // demonstrate switching to reverse after 5 seconds
    board.wait(5000, () => motor.reverse(255));
  });

  motor.on("reverse", () => {
    console.log(`reverse: ${Date.now()}`);

    // demonstrate braking after 5 seconds
    board.wait(5000, () => motor.brake(500));
  });

  // set the motor going forward full speed
  motor.forward(255);

});