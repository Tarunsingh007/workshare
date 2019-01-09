var mongoose=require('mongoose');
var schema=mongoose.Schema;

var commentschema=new schema({
	comment:{
		type:String
	},
	by:{
		type:String
	},
	postid:{
		type:String
	},
	noc:{
		type:String
	}
});


var Comments=mongoose.model('comments', commentschema);

module.exports=Comments;