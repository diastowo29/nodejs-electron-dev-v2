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

var gpio = require("gpio");

var stepperEnable = gpio.export(13, {
   direction: gpio.DIRECTION.OUT,
   interval: 200,
   ready: function() {
    console.log('stepperEnable ready')
    setInterval(function(){
      stepperEnable.set()
    }, 500);
    setTimeout(function(){
      stepperEnable.set(0)
    }, 1500);
   }
});