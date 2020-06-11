var Gpio = require('onoff').Gpio;
var pinEnable = new Gpio(13, 'out');
var pinDir = new Gpio(19, 'out');
var pinPulse = new Gpio(12, 'out');
// var ledPin = new Gpio(3, 'out');

// var trigger = new Gpio(23, 'out');
// var echo = new Gpio(24, 'in', 'rising');

// var timeTick;
// var timeTock;

// setInterval(function() {
//   console.log('triggering')
//   trigger.writeSync(0)
//   wait(2)
//   timeTick = new Date().getTime();
//   trigger.writeSync(1)
//   wait(10)
//   trigger.writeSync(0)
// }, 1000);

// echo.watch((err, value) => {
//   if (err) {
//     throw err;
//   }
//   console.log(value);
//   if (value == 1) {
//     timeTock = new Date().getTime()
//     console.log(timeTick)
//     console.log(timeTock)
//     console.log(timeTick - timeTock)
//   }
// });

// pinEnable.writeSync(0)
// pinDir.writeSync(1)

// var blinkInterval = setInterval(blinkLED, 0.005);

// // var subsidi = 3;

// // for (var i=0; i<1000; i++) {
// //   console.log('pinPulse: %s', pinPulse.readSync());
// //   pinPulse.writeSync(1);
// //   wait(5)
// //   console.log('pinPulse: %s', pinPulse.readSync());
// //   pinPulse.writeSync(0)
// //   wait(5)
// // }
// // pinPulse.writeSync(0);
// // pinDir.writeSync(0);
// // pinEnable.writeSync(1);
// // // ledPin.writeSync(0);
// // pinPulse.unexport();
// // pinDir.unexport();
// // pinEnable.unexport();
// // // ledPin.unexport();

// function blinkLED() {
//   console.log('pinPulse: %s', pinPulse.readSync())
//   if (pinPulse.readSync() === 0) {
//     pinPulse.writeSync(1);
//   } else {
//     pinPulse.writeSync(0);
//   }
// }



// function endBlink() {
//   console.log('end process')
//   clearInterval(blinkInterval);
//   pinPulse.writeSync(0);
//   pinDir.writeSync(0);
//   pinEnable.writeSync(1);
//   // ledPin.writeSync(0);
//   pinPulse.unexport();
//   pinDir.unexport();
//   pinEnable.unexport();
//   // ledPin.unexport();
// }

// setTimeout(endBlink, 50000);

// process.on('SIGINT', endBlink);






// const Gpio = require('pigpio').Gpio;

// // The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
// const MICROSECDONDS_PER_CM = 1e6/34321;

// const trigger = new Gpio(23, {mode: Gpio.OUTPUT});
// const echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});

// console.log('watch')
// trigger.digitalWrite(0); // Make sure trigger is low

// // const watchHCSR04 = () => {
// // };
// let startTick;

// echo.on('alert', (level, tick) => {
//   if (level == 1) {
//     startTick = tick;
//   } else {
//     const endTick = tick;
//     const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
//     console.log(diff / 2 / MICROSECDONDS_PER_CM);
//   }
// });

// // watchHCSR04();

// // Trigger a distance measurement once per second
// setInterval(() => {
//   trigger.trigger(10, 1); // Set trigger high for 10 microseconds
// }, 1000);












function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
// var newKuota = 45;
// var buf = Buffer.from(newKuota.toString(), 'utf8');

// var newData = [];

// for (var i=0; i<buf.length; i++) {
// newData.push(buf[i])
// }

// let data = [
// 52,
// 53
// ];
// console.log(data)
// console.log(newData)


            // var intKuota = parseInt("45");
            // var jatahSubs = parseInt('3');
            // var newKuota = intKuota - jatahSubs;
            // console.log(newKuota)

// var timeNow = new Date().getTime()
// console.log(timeNow);

// const Mfrc522 = require("mfrc522-rpi");
// const SoftSPI = require("rpi-softspi");

// const softSPI = new SoftSPI({
//   clock: 23, // 23 pin number of SCLK
//   mosi: 19, // 19 pin number of MOSI
//   miso: 21, // 21 pin number of MISO
//   client: 24 // 24 pin number of CS
// });

// // GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
// // I believe that channing pattern is better for configuring pins which are optional methods to use.
// const mfrc522 = new Mfrc522(softSPI).setResetPin(22);

// // watchHCSR04();
// setInterval(function() {
//   //# reset card
//   mfrc522.reset();


//   //# Scan for cards
//   let response = mfrc522.findCard();
//   if (!response.status) {
//     // console.log("No Card");
//     return;
//   }
//   console.log("Card detected, CardType: " + response.bitSize);

//   //# Get the UID of the card
//   response = mfrc522.getUid();
//   if (!response.status) {
//     console.log("UID Scan Error");
//     return;
//   }
//   const uid = response.data;
//   console.log(
//     "Card read UID: %s %s %s %s",
//     uid[0].toString(16),
//     uid[1].toString(16),
//     uid[2].toString(16),
//     uid[3].toString(16)
//   );

//   //# Select the scanned card
//   const memoryCapacity = mfrc522.selectCard(uid);
//   console.log("Card Memory Capacity: " + memoryCapacity);

//   //# This is the default key for authentication
//   const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

//   var blockIndexes = [1, 4];
//   var isAdmin = false;

//   for (var i=0; i<blockIndexes.length; i++) {
//     if (!mfrc522.authenticate(blockIndexes[i], key, uid)) {
//       console.log("Authentication Error");
//       return;
//     }

//     let bufferOriginal = Buffer.from(mfrc522.getDataForBlock(blockIndexes[i]));

//     console.log("Block: " + blockIndexes[i] + " Data: " + bufferOriginal.toString('utf8'));

//     // if (blockIndexes[i] == 1) {
//     //   if (bufferOriginal.toString('utf8').includes("admn")) {
//     //     console.log('this is admin')
//     //     isAdmin = true
//     //     mainWindow.webContents.send('role-data', "admin");
//     //   } else {
//     //     console.log('this is not admin')
//     //     mainWindow.webContents.send('role-data', "user");
//     //     isAdmin = false
//     //   }
//     // }


//     // if (blockIndexes[i] == 4) {
//     //   if (!isAdmin) {
//     //     if (berasRemain > 50) {
//     //       mainWindow.webContents.send('alert', 'beras-alert');
//     //     } else {
//     //       mainWindow.webContents.send('store-data', bufferOriginal.toString('utf8'));
//     //       var intKuota = parseInt(bufferOriginal.toString('utf8'), 10);
//     //       var jatahSubs = parseInt(beras);

//     //       if (intKuota > jatahSubs) {
//     //         console.log('cukup')
//     //         var newKuota = intKuota - jatahSubs;
//     //         mfrc522.writeDataToBlock(4, newData)
//     //         var buf = Buffer.from(newKuota.toString(), 'utf8');
            
//     //         console.log("STEPPER ROTATING");
//     //         pinEnable.writeSync(0)
//     //         pinDir.writeSync(1)
//     //         for (var i=0; i<(jatahSubs*200); i++) {
//     //           pinPulse.writeSync(1);
//     //           wait(10)
//     //           pinPulse.writeSync(0)
//     //           wait(10)
//     //         }

//     //       } else {
//     //         mainWindow.webContents.send('alert', 'alert');
//     //         console.log('kurang')
//     //       }
//     //       var newData = [];

//     //       for (var i=0; i<buf.length; i++) {
//     //         newData.push(buf[i])
//     //       }
//     //     }
//     //   }
//     // }

//   }

//   //# Stop
//   mfrc522.stopCrypto();
// }, 500);








/* NANO TIMER */
var NanoTimer = require('nanotimer');

var timer = new NanoTimer();

function main() {

  pinEnable.writeSync(0)
  pinDir.writeSync(1)

  timer.setInterval(stepperGo, '', '8u');
  timer.setTimeout(stepperOff, [timer], '20s');
}

function stepperGo () {
  pinEnable.writeSync(0)
  pinDir.writeSync(1)

  if (pinPulse.readSync() === 0) {
    pinPulse.writeSync(1);
    console.log('1')
  } else {
    pinPulse.writeSync(0);
    console.log('0')
  }
  // console.log('pinPulse: %s', pinPulse.readSync())
}

function stepperOff () {
  timer.clearInterval();
  console.log('end process')
  pinPulse.writeSync(0);
  pinDir.writeSync(0);
  pinEnable.writeSync(1);

  console.log('pinPulse: %s', pinPulse.readSync())
  console.log('pinDir: %s', pinDir.readSync())
  console.log('pinEnable: %s', pinEnable.readSync())
  
  pinPulse.unexport();
  pinDir.unexport();
  pinEnable.unexport();
}

main();