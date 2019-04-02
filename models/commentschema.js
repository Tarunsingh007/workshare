var mongoose=require('mongoose');
var schema=mongoose.Schema;
var userSchema=require('./userschema').schema;

var commentschema=new schema({
	comment:{
		type:String
	},
	by:{
		type:userSchema
	},
	postid:{
		type:String
	},
	created:{
		type:String
	}
});


var Comments=mongoose.model('comments', commentschema);

module.exports=Comments;