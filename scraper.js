var fs = require('fs');

var Scraper = require ('images-scraper');
//https://github.com/pevers/images-scraper
var google = new Scraper.Google();

var wordsToScrape = [];
var wordsRetrieved = 0;
var wordsSkipped = 0;
var wordsFailed = 0;


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
			    	wordsRetrieved++;
			    	success();
			    }
			}); 
		  } else {
		  	console.error('file exists');
		  	wordsSkipped++;
		  	success();
		  }
		}); 

	}).catch(function(err) {
		console.log('err', err);
		if (failure) {
			wordsFailed++;
			failure();
		}
	});
}



var text = fs.readFileSync("./input_files/lists/N1-Vocab-List.txt").toString('utf-8');
wordsToScrape = text.split('\n');
var totalCount = wordsToScrape.length;
var startTime = new Date();



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
	var seconds = (delta % 60).toFixed(2); 
	return `[ ${isNaN(days) ? '?' : days } Days, ` + 
				`${isNaN(hours) ? '?' : hours} Hours, ` + 
				`${isNaN(minutes) ? '?' : minutes} Minutes, ` + 
				`and ${isNaN(seconds) ? '?' : seconds} Seconds `;
}


function process() {
	var elapsedTimeMs = (new Date().getTime()) - startTime; // time ms?
	var wordsPerTime = wordsRetrieved / elapsedTimeMs;
	var estimatedTotalTime = (totalCount - wordsSkipped) / wordsPerTime;
	var timeLeftInSeconds = (estimatedTotalTime - elapsedTimeMs) / 1000;
	var elapsedTimeSeconds = elapsedTimeMs / 1000;
	
	console.log('Remaining # of Words: ' + wordsToScrape.length);
	var currentWord = wordsToScrape.shift();

	var remaining = ` ${(((totalCount - wordsToScrape.length) / totalCount) * 100).toFixed(2)}% (${wordsToScrape.length} of ${totalCount})`;
	console.log(`Words Retrieved This Session: ${wordsRetrieved}`);
	console.log(`Words Skipped: ${wordsSkipped}`);
	console.log(`Words Failed: ${wordsFailed}`);
	console.log('Current Word: ' + currentWord + remaining);
	console.log(`Elapsed Time: ` + getFriendlyTime(elapsedTimeSeconds)) + ` have passed.`;
	console.log(`Time Remaining: ` + getFriendlyTime(timeLeftInSeconds)) + `left.`;

	if (currentWord) {
		var writePath = 'results/' + currentWord;
		fs.exists(writePath, function(exists) { 
			  if (!exists) { 
			  	fetchImagesForWord(currentWord, process);
			  } else {
			  	wordsSkipped++;
			  	process();
			  }
		});
	}
}

console.log('WORDS TO SCRAPE:' + wordsToScrape.length);

process();





