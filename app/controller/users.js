
const User = require('../../models/users');
const passport = require('passport');
const auth =require('../config/auth')
const {findUserByToken}= require('../../utils/Queries')

exports.registration = async (req, res) => {
	req.body.email = req.body.username.toLowerCase();
	var NewUser = new User({
        fullName: req.body.fullName,
		username: req.body.username,
		email: req.body.username,
		
  });

	User.register(NewUser, req.body.password, function(err, user) {
    console.log(err)
		if (err) {
			var emailErr = "E11000 duplicate key error"
			if (err.message.substring(0, emailErr.length) === emailErr) {
				return res.send({
					error:"There was an error",
					message:"A user with that email address or username already exists"
					}
				);
			} else {
     		  return res.send({
					error:"There was an error",
					message:"A user with that email address or username already exists"
					});
			}
		}
		else {
			passport.authenticate("local")(req, res, function() {
				user.access_token=auth.createAccessToken(user._id);
				user.save();					
				return res.send({	
					  user:user,
					  response:"TRUE",
					  message:"Registration successful please login to continue"
					}
				);
			});
			
		}
		
	});
}


exports.loginUser = (req, res, next) => {

	console.log(req.body);

  req.body.username = req.body.username.toLowerCase();
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.send({
					response:"FALSE",
				    message:"Username or password is incorrect"}
			);
		}
		req.logIn(user, function(err) {
			if (err) {
				return res.send({
					error:err,
					message:"Error occured with login "}
				)
			}

			return res.send({
				    response:"TRUE",
				    user:user,
				    message:"Login Successful"
				}
			)
		});
	})
	(req, res, next); 
}



exports.verifyEmail = (req, res) => {

  
}


exports.forgotPasswordOtp = (req, res) => {
 
};


exports.resetPassword = (req, res) =>{
  
}



exports.updateProfile = (req, res) => {

    
}

exports.getProfile = async (req, res) => {

	console.log("TOKEN",req.header('authorization'));
	const accessToken=req.header('authorization');

	const Profile= await findUserByToken(accessToken);
	// Profile.map(res=>({

	// })

	
	res.send({
		message:"Profile Retrieved Successfully",
		user:Profile,
	})


}

