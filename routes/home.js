const router = require('express').Router();

router.get('/',(req,res)=>{
	res.send("Health check ok!");
});

module.exports = router;