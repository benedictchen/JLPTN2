var express = require('express');
var router = express.Router();
var pictureData = require('../data/giant-hashmap.json');
var weakkana = require('../public/javascripts/weakkana');

/* GET users listing. */
router.get('/:word', function(req, res, next) {

  var words = req.params.word.split(',');
  var results = [];
  words.forEach((word)=>{
  	console.log(weakkana.toKana(word))
  	var wordResults = pictureData[word] || pictureData[weakkana.toKana(word)] || [];
  	console.log(wordResults);
  	results = results.concat(wordResults || []);
  });
  res.send({results:results});
});

module.exports = router;
