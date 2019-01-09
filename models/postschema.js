var mongoose=require('mongoose');
var schema=mongoose.Schema;

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
		type:String
	},
	name:{
		type:String
	}
});


var Blogs=mongoose.model('blogs', blogschema);

module.exports=Blogs;