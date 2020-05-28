// var Gpio = require('onoff').Gpio;

// var stepperEnable = new Gpio(13, 'out');
// var stepperDir = new Gpio(19, 'out');
// var stepperPulse = new Gpio(26, 'out');

// var blinkInterval = setInterval(blinkLED, 250);

// function blinkLED() {
//     stepperEnable.writeSync(1);
//     stepperDir.writeSync(1);
//     stepperPulse.writeSync(1);
// }

// function endBlink() {
// 	turnOff()
// }

// function turnOff () {
// 	stepperPulse.writeSync(0)
// 	stepperDir.writeSync(0)
// 	stepperEnable.writeSync(0)

// 	stepperPulse.unexport()
// 	stepperDir.unexport()
// 	stepperEnable.unexport()
// }

// setTimeout(endBlink, 5000);

var gpio = require("gpio");

var stepperEnable = gpio.export(13, {
   direction: gpio.DIRECTION.OUT,
   interval: 200,
   ready: function() {
   	console.log('stepperEnable ready')
	var stepperDir = gpio.export(19, {
	   direction: gpio.DIRECTION.OUT,
	   interval: 200,
	   ready: function() {
	   	console.log('stepperDir ready')
		var stepperPulse = gpio.export(26, {
		   direction: gpio.DIRECTION.OUT,
		   interval: 200,
		   ready: function() {
		   	console.log('stepperPulse ready')





			stepperPulse.set(function() {
			   console.log('stepperPulse: ' + stepperPulse.value);
			   stepperDir.set(function() {
			   	console.log('stepperDir: ' + stepperDir.value);
			   	setInterval(function() {
			   		stepperEnable.set()
			   	}, 250)
			   	setTimeout( function () {
			   		stepperEnable.set(0)
			   	}, 5000);
			   })
			});
		   	
		   }
		});
	   }
	});
   }
});



