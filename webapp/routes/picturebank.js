var express = require('express');
var router = express.Router();
var pictureData = require('../data/giant-hashmap.json');


/* GET users listing. */
router.get('/:word', function(req, res, next) {
  var words = req.params.word.split(',');
  var results = [];
  words.forEach((word)=>{
  	results = results.concat(pictureData[word] || []);
  });
  res.send({results:results});
});

module.exports = router;
