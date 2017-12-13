var express = require('express');
var router = express.Router();

/* GET home page. 得到首页*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
