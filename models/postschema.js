var mongoose=require('mongoose');
var schema=mongoose.Schema;
var commentSchema=require('./commentschema').schema;
var userSchema=require('./userschema').schema;

var blogschema=new schema({
	title:{
		type:String
	},
	url:{
		type:String
	},
	text:{
		type:String
	},
	created:{
		type:Date,
		default:Date.now
	},
	by:{
		type:userSchema
	},
	name:{
		type:String
	},
	likedby:[],
	upvotes:Number,
	section:{
		type:String
	},
	comments:[commentSchema]
});


var Blogs=mongoose.model('blogs', blogschema);

module.exports=Blogs;