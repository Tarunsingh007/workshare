var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');
var schema=mongoose.Schema;

var userschema=new schema({
	username:{
		type:String
	},
	password:{
		type:String
	},
	upvotedPosts:[],
	created:{
		type:Date,
		default:Date.now
	}
});
userschema.methods.hashPassword=function(password){
	return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}
userschema.methods.comparePassword=function(password,hash){
	return bcrypt.compareSync(password,hash);
}

var User=mongoose.model('user', userschema);

module.exports=User;