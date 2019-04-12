const express = require('express');
const router = express.Router();
const User=require('../models/userschema.js');
const passport=require('passport');
const passportconfig=require('../config/passportconfig.js');
const middleware=require('../authenticate.js');
const Post=require('../models/postschema.js');
const Comment=require('../models/commentschema.js');
const _=require('lodash');
var sz=10;
//ask route
router.get('/',(req,res)=>{
	var pg=parseInt(req.query.pg);
	if(isNaN(pg))
	pg=1;
	var sk=Number(sz*(pg-1));
	var query={};
	query.skip=sz*(pg-1);
	query.limit=sz;
	Post.count({section:"show"},function(err,c){
		var totalpages=Math.ceil(parseFloat(c/sz));
	Post.find({section:"ask"},{},query).then((ask)=>{
		if(!ask)
			console.log("no questions");
    res.render('ask',{user:req.user,ask:ask,pg:totalpages,s:sk});
	});
});
});

router.get('/upvote/:id',middleware.isLoggedIn,(req,res)=>{
	var userId=req.user._id;
	var postId=req.params.id;
    User.findById(userId).then((user)=>{
		if (_.includes(req.user.upvotedPosts, String(postId)))
		{
			console.log("already liked");
			res.redirect('/ask');
		}
		else
		{
			user.upvotedPosts.push(String(postId))
			user.save().then((data)=>{
				if (data)
				console.log("post liked and saved it's id in user schema");
			});
			Post.findById(postId).then((post)=>{
				if(!post)
				console.log("not found");
				post.upvotes+=1;
				post.likedby.push(req.user._id);
				post.save().then(()=>{
					console.log(post.upvotes);
					res.redirect(`/ask`);
				})
			});
		}
    });
});

module.exports = router;