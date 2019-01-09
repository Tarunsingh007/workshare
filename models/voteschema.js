var mongoose=require('mongoose');
var schema=mongoose.Schema;

var voteschema=new schema({
	vote:{
		type:Number
	},
	by:{
		type:String
	},
	postid:{
		type:String
	}
});


var Votes=mongoose.model('votes', voteschema);

module.exports=Votes;