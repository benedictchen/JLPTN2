var fs = require('fs');

var giantHashmap = {};

var RESULTS_FOLDER = 'results';

fs.readdir('results', (err, files) => {
	console.log('files found:' + files);
	files.forEach(file => {
		console.log('Reading file: ' + file);
		var path = RESULTS_FOLDER + '/' + file;
		var fileText = fs.readFileSync(path).toString('utf-8');
		var parsedText = JSON.parse(fileText);
		console.log(parsedText);
		giantHashmap[file] = parsedText;
	});
	console.log(giantHashmap);
	var result = JSON.stringify(giantHashmap);
	fs.writeFile("output/giant-hashmap.json", result, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	}); 
});

