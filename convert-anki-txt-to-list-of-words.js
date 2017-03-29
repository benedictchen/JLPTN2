var fs = require('fs');
var striptags = require('striptags');

var text = fs.readFileSync('./input_files/anki/N1-Kanji.txt').toString('utf-8');
 
var items = striptags(text).split('\n');

var cleanedItems = [];

items.forEach((item)=>{
	cleanedItems.push(item.replace(/\"/g,'').split('\t'));
});

var formattedItems = [];

var outputData = '';

var count = 0;

cleanedItems.forEach((cleanedItem) => {
	var kanaAndYomikata = cleanedItem[0].split(/\s/g);
	var kana = (kanaAndYomikata[0] || '').replace(/(\(.*\))/g, '').replace(/[\[\]]/g, '');
	var yomikata = (kanaAndYomikata[1] || '').replace(/(\(.*\))/g, '').replace(/[\[\]]/g, '');
	var english = (cleanedItem[1] || '').replace(/(\(.*\))/g, '').replace(/[\[\]]/g, '');

	// formattedItems.push([
	// 	count,
	// 	yomikata,
	// 	kana,
	// 	english,
	// ]);
	// count++;
	outputData += kana + '\n';
});



// var outputData = JSON.stringify(formattedItems);

var OUTPUT_PATH = 'output/N1-Kanji-List.txt';
fs.exists(OUTPUT_PATH, function(exists) { 
  if (!exists) { 
	fs.writeFile(OUTPUT_PATH, outputData, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log('The file was saved!');
	}); 
  } else {
  	console.error('file exists');
  }
}); 


