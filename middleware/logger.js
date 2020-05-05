function log(req,res,next){
	console.log("Testing...");
	next();
}

module.exports = log;