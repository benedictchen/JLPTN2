var fs = require('fs');

var Scraper = require ('images-scraper');
//https://github.com/pevers/images-scraper
var google = new Scraper.Google();

var wordsToScrape = [];


function fetchImagesForWord(word, success, failure) {
	google.list({
		keyword: word,
		num: 50,
		rlimit: '2',	
		detail: true,
		nightmare: {
			show: true
		},
		timeout: 10000,	
	})
	.then(function (res) {
		console.log('----------------------------------------');
		console.log('first N results from google', res);
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



var text = fs.readFileSync("./input_files/lists/N1-Vocab-List.txt").toString('utf-8');
wordsToScrape = text.split('\n');
var totalCount = wordsToScrape.length;
var startTime = new Date();
var wordsRetrieved = 0;


function getFriendlyTime(totalSeconds) {
	// get total seconds between the times
	var delta = totalSeconds;

	// calculate (and subtract) whole days
	var days = Math.floor(delta / 86400);
	delta -= days * 86400;

	// calculate (and subtract) whole hours
	var hours = Math.floor(delta / 3600) % 24;
	delta -= hours * 3600;

	// calculate (and subtract) whole minutes
	var minutes = Math.floor(delta / 60) % 60;
	delta -= minutes * 60;

	// what's left is seconds
	var seconds = delta % 60; 
	return `[ ${isNaN(days) ? '?' : days } Days, ` + 
				`${isNaN(hours) ? '?' : hours} Hours, ` + 
				`${isNaN(minutes) ? '?' : minutes} Minutes, ` + 
				`and ${isNaN(seconds) ? '?' : seconds} Seconds `;
}


function process() {
	var elapsedTime = (new Date().getTime()) - startTime;
	var wordsPerTime = wordsRetrieved / elapsedTime;
	var estimatedTotalTime = totalCount / wordsPerTime;
	var timeLeftInSeconds = (estimatedTotalTime - elapsedTime) / 1000;
	var elapsedTimeSeconds = elapsedTime / 1000;
	
	console.log('Grabbing from: ' + wordsToScrape.length);
	var currentWord = wordsToScrape.shift();

	var remaining = ` ${(wordsToScrape.length / totalCount).toFixed(2)}% (${wordsToScrape.length} of ${totalCount})`;
	console.log('current word: ' + currentWord + remaining);
	console.log(`Elapsed Time: ` + getFriendlyTime(elapsedTimeSeconds)) + ` have passed.`;
	console.log(`Time Remaining: ` + getFriendlyTime(timeLeftInSeconds)) + `left.`;

	if (currentWord) {
		var writePath = 'results/' + currentWord;
		fs.exists(writePath, function(exists) { 
			  if (!exists) { 
			  	wordsRetrieved++;
			  	fetchImagesForWord(currentWord, process);
			  } else {
			  	process();
			  }
		});
	}
}

console.log('WORDS TO SCRAPE:' + wordsToScrape.length);

process();





