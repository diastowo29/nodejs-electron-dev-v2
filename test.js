var Gpio = require('onoff').Gpio;

var stepperEnable = new Gpio(13, 'out');
var stepperDir = new Gpio(19, 'out');
var stepperPulse = new Gpio(26, 'out');

let stopBlinking = false;

stepperEnable.write(1, err => { // Asynchronous write
	console.log('stepperEnable.write')
	if (err) {
		console.log(err)
		throw err;
	}
});
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

