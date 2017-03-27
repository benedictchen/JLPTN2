var fs = require('fs');

var item = 'test';
fs.exists('results/test1', function(exists) { 
  if (!exists) { 
	fs.writeFile("results/test1", item, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log("The file was saved!");
	}); 
  } else {
  	console.error('file exists');
  }
}); 

