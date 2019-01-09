var mongoose=require('mongoose');
var schema=mongoose.Schema;

var showschema=new schema({
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


var Show=mongoose.model('show', showschema);

module.exports=Show;