/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
})

const fs = require('fs'); 
const csv = require('csv-parser');

fs.createReadStream('adata.csv')
.pipe(csv())
.on('data', function(data){
    try {
        console.log("Name is: "+data.NAME);
        console.log("Age is: "+data.AGE);

        //perform the operation
    }
    catch(err) {
        //error handler
    }
})
