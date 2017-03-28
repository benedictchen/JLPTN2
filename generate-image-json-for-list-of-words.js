/**
 * This file is meant to grab a small selection of images given
 * a list of words to grab images for.
 */

var fs = require('fs');

var giantHashmap = {};

var INPUT_WORD_LIST = './n3-kanji-to-scrape.txt';
var text = fs.readFileSync(INPUT_WORD_LIST).toString('utf-8');
var words = text.split('\n');

var RESULTS_FOLDER = 'results';

var currentCount = 0;

words.forEach(word => {
	fs.exists('results/' + word, function(exists) { 
  		if (exists) { 
			console.log('Reading  for word: ' + word);
			var path = RESULTS_FOLDER + '/' + word;
			var fileText = fs.readFileSync(path).toString('utf-8');
			var parsedText = JSON.parse(fileText);
			console.log(parsedText);
			giantHashmap[word] = parsedText;
			currentCount++;
		}
		if (currentCount >= words.length) {
			generateOutput();
		}
	});
});

function generateOutput() {
	console.log(giantHashmap);
	var result = JSON.stringify(giantHashmap);
	var outputName = INPUT_WORD_LIST.replace(/[/\\]/,'').replace('.txt','');
	fs.writeFile(`output/images-for-${outputName}.json`, result, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log('The file was saved!');
	}); 
}

