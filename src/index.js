const { app, BrowserWindow } = require('electron');
const path = require('path');
const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");
const Store = require('./store.js');
const ipcMain = require('electron').ipcMain;
var Gpio = require('onoff').Gpio;

var pinEnable = new Gpio(13, 'out');
var pinDir = new Gpio(19, 'out');
var pinPulse = new Gpio(21, 'out');

const piGpio = require('pigpio').Gpio;
var berasRemain = 0;

var isTambahKartu = false;
var startKosongkanTangki = false
var isTambahKuota = false;
var newTambahKuota = '';

pinEnable.writeSync(1);

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6/34321;

const trigger = new piGpio(23, {mode: Gpio.OUTPUT});
const echo = new piGpio(27, {mode: Gpio.INPUT, alert: true});

console.log('watch')
trigger.digitalWrite(0); // Make sure trigger is low

// const watchHCSR04 = () => {
// };
let startTick;

echo.on('alert', (level, tick) => {
  if (level == 1) {
    startTick = tick;
  } else {
    const endTick = tick;
    const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
    console.log(diff / 2 / MICROSECDONDS_PER_CM);
    berasRemain = diff / 2 / MICROSECDONDS_PER_CM
  }
});

// watchHCSR04();

// Trigger a distance measurement once per second
setInterval(() => {
  trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 1000);

//# This loop keeps checking for chips. If one is near it will get the UID and authenticate
console.log("scanning...");
console.log("Please put chip or keycard in the antenna inductive zone!");
console.log("Press Ctrl-C to stop.");

const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: { beras: 2 }
  }
});

const softSPI = new SoftSPI({
  clock: 23, // 23 pin number of SCLK
  mosi: 19, // 19 pin number of MOSI
  miso: 21, // 21 pin number of MISO
  client: 24 // 24 pin number of CS
});

// GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
// I believe that channing pattern is better for configuring pins which are optional methods to use.
const mfrc522 = new Mfrc522(softSPI).setResetPin(22);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // createWindow()
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {nodeIntegration: true}
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // mainWindow.webContents.openDevTools();
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow() 
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {

    // mainWindow.webContents.send('admin-data', beras);



    // watchHCSR04();
    setInterval(function() {
      //# reset card
      mfrc522.reset();

      //# Scan for cards
      let response = mfrc522.findCard();
      if (!response.status) {
        // console.log("No Card");
        return;
      }
      console.log("Card detected, CardType: " + response.bitSize);

      //# Get the UID of the card
      response = mfrc522.getUid();
      if (!response.status) {
        console.log("UID Scan Error");
        return;
      }
      const uid = response.data;
      console.log(
        "Card read UID: %s %s %s %s",
        uid[0].toString(16),
        uid[1].toString(16),
        uid[2].toString(16),
        uid[3].toString(16)
      );

      //# Select the scanned card
      const memoryCapacity = mfrc522.selectCard(uid);
      console.log("Card Memory Capacity: " + memoryCapacity);

      //# This is the default key for authentication
      const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

      var blockIndexes = [1, 4];
      var isAdmin = false;

      for (var i=0; i<blockIndexes.length; i++) {
        if (!mfrc522.authenticate(blockIndexes[i], key, uid)) {
          console.log("Authentication Error");
          return;
        }

        let bufferOriginal = Buffer.from(mfrc522.getDataForBlock(blockIndexes[i]));

        console.log("Block: " + blockIndexes[i] + " Data: " + bufferOriginal.toString('utf8'));

        let { beras } = store.get('windowBounds');
        if (blockIndexes[i] == 1) {
          if (bufferOriginal.toString('utf8').includes("admn")) {
            console.log('this is admin')
            isAdmin = true
            mainWindow.webContents.send('role-data', "admin");
            mainWindow.webContents.send('admin-data', beras);
          } else if (bufferOriginal.toString('utf8').includes("user")){
            console.log('this is not admin')
            mainWindow.webContents.send('role-data', "user");
            isAdmin = false
          } else {
            if (isTambahKartu) {
              var tambahKartuBuf = Buffer.from('user', 'utf8');
              var newKartuData = [];

              for (var i=0; i<tambahKartuBuf.length; i++) {
                newKartuData.push(tambahKartuBuf[i])
              }
              mfrc522.writeDataToBlock(1, newKartuData)
              isTambahKartu = false;
            }
          }
        }


        if (blockIndexes[i] == 4) {
          if (!isAdmin) {
            if (isTambahKuota) {
              var tambahKuotaBuf = Buffer.from(newTambahKuota, 'utf8');
              var newTambahKuotaData = [];

              for (var i=0; i<tambahKuotaBuf.length; i++) {
                newTambahKuotaData.push(tambahKuotaBuf[i])
              }
              mfrc522.writeDataToBlock(4, newTambahKuotaData);
            } else {
              if (berasRemain > 50) {
                mainWindow.webContents.send('alert', 'beras-alert');
              } else {
                if (isTambahKartu) {
                  console.log('isTambahKartu: ' + isTambahKartu);
                } else {
                  mainWindow.webContents.send('store-data', bufferOriginal.toString('utf8'));
                  var intKuota = parseInt(bufferOriginal.toString('utf8'), 10);
                  var jatahSubs = parseInt(beras);

                  if (intKuota > jatahSubs) {
                    console.log('cukup')
                    var newKuota = intKuota - jatahSubs;
                    mainWindow.webContents.send('store-data', newKuota);
                    var buf = Buffer.from(newKuota.toString(), 'utf8');
                    var newData = [];

                    for (var i=0; i<buf.length; i++) {
                      newData.push(buf[i])
                    }
                    mfrc522.writeDataToBlock(4, newData)
                    
                    console.log("STEPPER ROTATING");
                    pinEnable.writeSync(0)
                    pinDir.writeSync(1)
                    for (var i=0; i<(jatahSubs*200); i++) {
                      pinPulse.writeSync(1);
                      wait(10)
                      pinPulse.writeSync(0)
                      wait(10)
                    }
                    wait(1000);
                    pinEnable.writeSync(1)
                    mainWindow.webContents.send('clear', 'alert');
                  } else {
                    mainWindow.webContents.send('alert', 'alert');
                    console.log('kurang')
                  }
                }
              }
            }
          }
        }

      }

      //# Stop
      mfrc522.stopCrypto();
    }, 500);
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('kuota', function(event, data) {
  console.log(data)
  store.set('windowBounds', { beras: data });
  beras = data
  console.log(beras)
});

ipcMain.on('new-kuota', function(event, data) {
  newTambahKuota = data
});

ipcMain.on('tambah-kartu', function(event, data) {
  isTambahKartu = true;
});

ipcMain.on('kosongkan-tangki', function(event, data) {
  startKosongkanTangki = data
  var rotateInterval;
  if (startKosongkanTangki) {

    // pinDir.writeSync(1)
    // pinPulse.writeSync(1);
    //   wait(10)
    //   pinPulse.writeSync(0)
    //   wait(10)

    console.log("STEPPER ROTATING");
    pinEnable.writeSync(0)
    pinDir.writeSync(1)
    rotateInterval = setInterval(rotateStepper, 10);
  } else {
    wait(1000);
    pinEnable.writeSync(1)
    clearInterval(rotateInterval);
  }

});
  function rotateStepper() {
    if (pinPulse.readSync() === 0) {
      pinPulse.writeSync(1);
      ledPin.writeSync(1);
    } else {
      pinPulse.writeSync(0);
      ledPin.writeSync(0);
    }
    if (!startKosongkanTangki) {
      clearInterval()
    }
  }


function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}