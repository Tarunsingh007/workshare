const express = require('express');
const router = express.Router();
const User=require('../models/userschema.js');
const passport=require('passport');
const passportconfig=require('../config/passportconfig.js');
const middleware=require('../authenticate.js');

//login ,signup and logout routes
router.get('/login',(req,res)=>{
	res.render('login');
});
router.post('/login',passport.authenticate('local',{
	failureRedirect:'/auth/login',
	successRedirect:'/'
}));
router.post('/signup',(req,res,next)=>{
	User.findOne({ username:req.body.usersignup }).then((currentuser)=>{
		if(currentuser)
			{console.log("user exists");res.redirect('/login');}
		else
		{
			let username=req.body.usersignup;
			let password=req.body.passsignup;
			let date=new Date().toString().substring(1,15);
			var newuser=new User();
			newuser.password=newuser.hashPassword(password);
			newuser.username=username;
			newuser.created=date;
			newuser.save((err,data)=>{
				if(err)
					console.log(err);
				else
					res.send('please login now registration successful');
			});
		}
	});
});
router.get('/logout',middleware.isLoggedIn,(req,res)=>{
	req.logout();
	res.redirect("/");
	console.log("loggedout");
});
module.exports = router;
