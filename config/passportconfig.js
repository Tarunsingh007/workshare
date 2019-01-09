const passport=require('passport');
var User =require('../models/userschema.js');
const LocalStrategy=require('passport-local').Strategy;
//passport configuraiton
passport.serializeUser((user,done)=>{
  done(null, user.id);
});

passport.deserializeUser((id,done)=>{
  User.findById(id).then((user)=>{
    done(null,user);
  });
});
 
passport.use(new LocalStrategy(
  function(username, password, done) {
  	User.findOne({username:username},(err,user)=>{
  		if(err)
  			throw err;
  		if(!user)
  			{return done(null,false);}
  		else
  		{
  			if(user)
  			{
  				var valid=user.comparePassword(password,user.password);
  				if(valid)
  				{
  					return done(null,user);
  				}
  				else
  				{
  					return done(null,false)
  				}
  			}
  		}
  	})
  }
));