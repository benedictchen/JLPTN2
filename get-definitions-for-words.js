var fs = require('fs');
var http = require('http');

var JISHO_API_URL = `http://jisho.org/api/v1/search/words?keyword=`;

function getWord(word, callback) {

	var encodedWord = encodeURIComponent(word);

	var options = {
		host: 'jisho.org',
		path: '/api/v1/search/words?keyword=' + encodedWord,
		port: 80
	};

	var cb = function(response) {
		var str = '';
		response.on('data', function (chunk) {
			str += chunk;
		});
		response.on('end', function () {
			callback(str);
		});
	}

	http.request(options, cb).end();
}

var text = fs.readFileSync("./n3-kanji-to-scrape.txt").toString('utf-8');
var words = text.split('\n');

var WAIT_TIME_MS = 800;

function process() {
	var word = words.pop();
	if (!word) {
		return;
	}
	getWord(word, (data) => {
		var path = 'definitions/' + word;
		fs.exists(path, function(exists) { 
			if (!exists) { 
				fs.writeFile(path, data, function(err) {
					if(err) {
						return console.log(err);
					}
					console.log('The file was saved!');
					setTimeout(process, WAIT_TIME_MS);
				}); 
			} else {
				console.error('file exists');
			}
		}); 
	});
}

process();
