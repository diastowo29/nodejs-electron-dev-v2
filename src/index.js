const { app, BrowserWindow } = require('electron');
const path = require('path');
const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");

//# This loop keeps checking for chips. If one is near it will get the UID and authenticate
console.log("scanning...");
console.log("Please put chip or keycard in the antenna inductive zone!");
console.log("Press Ctrl-C to stop.");

const softSPI = new SoftSPI({
  clock: 23, // pin number of SCLK
  mosi: 19, // pin number of MOSI
  miso: 21, // pin number of MISO
  client: 24 // pin number of CS
});

// GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
// I believe that channing pattern is better for configuring pins which are optional methods to use.
const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

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
  mainWindow.webContents.openDevTools();
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow() 
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('store-data', 'stores');
    setInterval(function() {
      //# reset card
      mfrc522.reset();

      //# Scan for cards
      let response = mfrc522.findCard();
      if (!response.status) {
        mainWindow.webContents.send('store-data', 'No Card');
        console.log("No Card");
        return;
      }
      mainWindow.webContents.send('store-data', 'Card detected, CardType: ' + response.bitSize);
      console.log("Card detected, CardType: " + response.bitSize);

      //# Get the UID of the card
      response = mfrc522.getUid();
      if (!response.status) {
        console.log("UID Scan Error");
        mainWindow.webContents.send('store-data', 'UID Scan Error');
        return;
      }
      //# If we have the UID, continue
      const uid = response.data;
      mainWindow.webContents.send('store-data', uid[0].toString(16));
      mainWindow.webContents.send('store-data', uid[1].toString(16));
      mainWindow.webContents.send('store-data', uid[2].toString(16));
      mainWindow.webContents.send('store-data', uid[3].toString(16));
      console.log(
        "Card read UID: %s %s %s %s",
        uid[0].toString(16),
        uid[1].toString(16),
        uid[2].toString(16),
        uid[3].toString(16)
      );

      //# Select the scanned card
      const memoryCapacity = mfrc522.selectCard(uid);
      mainWindow.webContents.send('store-data', "Card Memory Capacity: " + memoryCapacity);
      console.log("Card Memory Capacity: " + memoryCapacity);

      //# This is the default key for authentication
      const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

      var blockIndex1 = 1;
      var blockIndex2 = 2;
      var blockIndex3 = 3;
      var blockIndex4 = 4;

      //# Authenticate on Block 8 with key and uid
      if (!mfrc522.authenticate(blockIndex1, key, uid)) {
        console.log("Authentication Error");
        mainWindow.webContents.send('store-data', "Authentication Error");
        return;
      }

      console.log("Block: " + blockIndex1 + " Data: " + mfrc522.getDataForBlock(blockIndex1));
      mainWindow.webContents.send('store-data', "Block: " + blockIndex1 + " Data: " + mfrc522.getDataForBlock(blockIndex1));

      if (!mfrc522.authenticate(blockIndex2, key, uid)) {
        console.log("Authentication Error");
        mainWindow.webContents.send('store-data', "Authentication Error");
        return;
      }

      console.log("Block: " + blockIndex2 + " Data: " + mfrc522.getDataForBlock(blockIndex2));
      mainWindow.webContents.send('store-data', "Block: " + blockIndex2 + " Data: " + mfrc522.getDataForBlock(blockIndex2));


      if (!mfrc522.authenticate(blockIndex3, key, uid)) {
        console.log("Authentication Error");
        mainWindow.webContents.send('store-data', "Authentication Error");
        return;
      }

      console.log("Block: " + blockIndex3 + " Data: " + mfrc522.getDataForBlock(blockIndex3));
      mainWindow.webContents.send('store-data', "Block: " + blockIndex3 + " Data: " + mfrc522.getDataForBlock(blockIndex3));

      if (!mfrc522.authenticate(blockIndex4, key, uid)) {
        console.log("Authentication Error");
        mainWindow.webContents.send('store-data', "Authentication Error");
        return;
      }

      console.log("Block: " + blockIndex4 + " Data: " + mfrc522.getDataForBlock(blockIndex4));
      mainWindow.webContents.send('store-data', "Block: " + blockIndex4 + " Data: " + mfrc522.getDataForBlock(blockIndex4));
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