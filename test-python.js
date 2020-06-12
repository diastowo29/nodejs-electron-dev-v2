const spawn = require("child_process").spawn;
const pythonProcess = spawn('python',["test.py", 3]);

pythonProcess.stdout.on('data', (data) => {
    // Do something with the data returned from python script
    console.log(data.toString())
});
