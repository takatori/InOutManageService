var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});


/* GET account add page */
reouter.get('/accounts/add', (req, res, next) => {
    res.render('add');
})

module.exports = router;
