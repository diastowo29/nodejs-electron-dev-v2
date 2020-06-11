const axios = require('axios');

// axios.get('test.py')
//   .then(response => {
//     console.log(response.data.url);
//     console.log(response.data.explanation);
//   })
//   .catch(error => {
//     console.log(error);
//   });

// $.ajax({
//     type: "POST",
//     url: "test.py",
//     data: { param: " "}, 
//     dataType: "text"
//     }).done(function( o ) {
//         alert("OK");
// });

const spawn = require("child_process").spawn;
const pythonProcess = spawn('python',["test.py", 3]);

pythonProcess.stdout.on('data', (data) => {
    // Do something with the data returned from python script
    console.log(data.toString())
});
