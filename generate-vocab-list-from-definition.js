var fs = require('fs');

var giantList = [];

var OUTPUT_NAME = 'n3-vocab-list';

var DEFINITIONS_FOLDER = 'definitions';

fs.readdir(DEFINITIONS_FOLDER, (err, files) => {
	console.log('files found:' + files);
	var count = 0;
	files.forEach(file => {
		console.log('Reading file: ' + file);
		var path = DEFINITIONS_FOLDER + '/' + file;
		var fileText = fs.readFileSync(path).toString('utf-8');
		var parsedData = JSON.parse(fileText);

		var dataItem = parsedData.data[0];

		var matchingJapaneseDef = null;
		dataItem.japanese.forEach((jDef) => {
			if (jDef.word === file) {
				matchingJapaneseDef = jDef;
			}
		});
		if (!matchingJapaneseDef) {
			console.error('Matching definition not found for: ' + file);
			// Just grab the closest definition then.
			matchingJapaneseDef = dataItem.japanese[0];
		}

		var engDefs = [];
		dataItem.senses.forEach((sense) => {
			engDefs = engDefs.concat(sense.english_definitions);
		})

		// Grab all the English definitions.
		var yomikata = matchingJapaneseDef.reading;
		var japanese = matchingJapaneseDef.word;
		var english = engDefs.join(';');

		giantList.push([count, yomikata, japanese, english]);
		count++;
	});
	console.log(giantList);
	var result = JSON.stringify(giantList);
	fs.writeFile(`output/${OUTPUT_NAME}.json`, result, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	}); 
});

