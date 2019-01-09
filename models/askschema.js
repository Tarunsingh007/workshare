var mongoose=require('mongoose');
var schema=mongoose.Schema;

var askschema=new schema({
	title:{
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


var Ask=mongoose.model('ask', askschema);

module.exports=Ask;