var fs = require('fs');
var csv = require("fast-csv");

var outputText = '';

var stream = fs.createReadStream("JLPT-N2-vocab-csv.csv");
	
	csv.fromStream(stream, {ignoreEmpty: true})
		.on("data", function(data){
			// console.log(data);
			if (data[2]) {
				// try for item 2 (kanji plus kana)
				console.log(data[2]);
				outputText += data[2] + '\n';
			} else if (!data[2] && data[1]){
				// if fail use item 1 (probably katakana?)	
				console.log(data[1]);
				outputText += data[1] + '\n';
			} else {
				// else use definition at item 3.
				console.log(data[3]);
				outputText += data[3] + '\n';
			}
		})
		.on("end", function(){
			fs.writeFile("words-to-scrape.txt", outputText, function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("The file was saved!");
			}); 
			  
			console.log("done");
});