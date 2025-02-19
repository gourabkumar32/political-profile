const express = require('express');
const router = express.Router();
const { getAllMLAs, getMLAsByState } = require('../controllers/mlaController');


router.get("/hi",(req,res)=>{
    console.log("done");
  })
router.get('/', getAllMLAs);
router.get('/state/:state', getMLAsByState);

module.exports = router;