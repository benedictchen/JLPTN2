var fs = require('fs');

var Scraper = require ('images-scraper');
//https://github.com/pevers/images-scraper
var google = new Scraper.Google();

var wordsToScrape = [];


function fetchImagesForWord(word, success, failure) {
	google.list({
		keyword: word,
		num: 20,
		rlimit: '2',	
		detail: true,
		nightmare: {
			show: true
		},
		timeout: 10000,	
	})
	.then(function (res) {
		console.log('----------------------------------------');
		console.log('first 10 results from google', res);
		console.log('----------------------------------------');
		var encodedText = JSON.stringify(res);
		
		var writePath = 'results/' + word;
		fs.exists(writePath, function(exists) { 
		  if (!exists) { 
			fs.writeFile(writePath, encodedText, function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("The file was saved!");
			    if (success) {
			    	success();
			    }
			}); 
		  } else {
		  	console.error('file exists');
		  	success();
		  }
		}); 

	}).catch(function(err) {
		console.log('err', err);
		if (failure) {
			failure();
		}
	});
}



var text = fs.readFileSync("./words-to-scrape.txt").toString('utf-8');
wordsToScrape = text.split('\n');

function process() {
	console.log('Grabbing from: ' + wordsToScrape.length);
	var currentWord = wordsToScrape.shift();
	console.log('The current word is: ', currentWord);
	if (currentWord) {
		var writePath = 'results/' + currentWord;
		fs.exists(writePath, function(exists) { 
			  if (!exists) { 
			  	fetchImagesForWord(currentWord, process);
			  } else {
			  	process();
			  }
		});
	}
}

console.log('WORDS TO SCRAPE:' + wordsToScrape.length);

process();





