const express = require('express');
const router = express.Router();
const catService = require('../services/cat_service');

/* GET home page. */
router.get('/cat', (req, res, next) => {
  catService.getNextCat()
    .then((cat) => res.json(cat))
    .catch((e) => console.error(e));
});

module.exports = router;
