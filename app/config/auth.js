
const config= require('./config')
const jwt= require('jsonwebtoken')
exports.createIdToken = (user)=> {
	 return jwt.sign({
		exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60),
		data: user
	  }, 'secret');
  }
  
  exports.createAccessToken=(id)=> {
	  console.log("user id yenye tunataka ni",id);
	return jwt.sign({
	  user:id,
	  field:"custom field",
	  scope: 'full_access',
	}, 
	config.secret,
	{
		issuer:config.issuer,
		audience:config.audience,
		expiresIn:"7d"
	}
	);
  }