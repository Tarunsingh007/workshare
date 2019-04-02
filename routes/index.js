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
router.get('/',(req,res)=>{
	var pg=parseInt(req.query.pg);
	var query={};
	query.skip=sz*(pg-1);
	query.limit=sz;
	Post.count({section:"post"},function(err,c){
		var totalpages=Math.ceil(parseFloat(c/sz));	
		Post.find({section:"post"},{},query).then((post)=>{
			if(!post)
			console.log("no posts");
				res.render('index',{user:req.user,posts:post,pg:totalpages});
		});
	});

});

//trending posts route
router.get('/trending',(req,res)=>{
	var pg=parseInt(req.query.pg);
	var query={};
	var size=sz*(pg-1);
	query.skip=size;
	query.limit=sz;
	Post.count({},function(err,c){
		var totalpages=Math.ceil(parseFloat(c/sz));
	Post.find({},{},query).sort({upvotes:-1}).then((post)=>{
		if(!post)
			console.log("no posts");
			res.render('trending',{user:req.user,posts:post,pg:totalpages,size:size});
	});
});
});

//hide post route
router.get('/post/hide/:id',middleware.isLoggedIn,(req,res)=>{
	let id=req.params.id;
});

//new post route
// router.get('/new',(req,res)=>{
// 	Post.find().sort({created:-1}).then((post)=>{
// 		if(!post)
// 			console.log("no posts");
// 			res.render('new',{user:req.user,posts:post});
// 	});
// });

//comment routes----------------
router.get('/post/comment/delete/:id',middleware.validuser,(req,res)=>{
	let id=req.params.id;
	Comment.findOne({_id:id}).then((com)=>{
		Comment.deleteOne({_id:id}).then((done)=>{
			if(!done)
			console.log("not found");
			else
			{	
				console.log(com.postid);
				Post.findOne({_id:com.postid}).then((post)=>{
					if(!post)
					console.log("post error");
					post.comments=post.comments.filter((obj)=>{
						return String(obj._id)!==id;
					});
					post.save().then(()=>{
						res.redirect(`/post/comment/${com.postid}`);
					});
				});
			}	
		})
	});
});
router.get('/post/comment/update/:id',middleware.validuser,(req,res)=>{
	Comment.findById(req.params.id).then((com)=>{
	res.render('updatecomment',{commentid:req.params.id,data:com.comment});
	});
});

router.put('/post/comment/update/:id',(req,res,next)=>{
   Comment.findOneAndUpdate({_id:req.params.id},{comment:req.body.comm},(err,comment)=>{
      if(err)
         return err;
      else
       	res.redirect('/post/comment/'+comment.postid);
   });
});
router.get('/post/comment/:id',(req,res)=>{
	let id=req.params.id;
	Comment.find({postid:id}).then((comment)=>{
	Post.findById(id).then((post)=>{
		res.render('comment',{comments:comment,
							  post:post,
							  postid:id,
							  user:req.user});
		});
	});
});
router.post('/post/comment/:id',middleware.isLoggedIn,(req,res)=>{
	let id=req.params.id;
	let comment=req.body.com;
	let date=new Date().toString().substring(1,15);
	console.log(date);
	var newcomment=new Comment({
		comment:comment,
		by:req.user._id,
		postid:id,
		by:req.user,
		created:date
	})
	newcomment.save().then((comment)=>{
		if(!comment)
			console.log(err);
		Post.findOne({_id:id}).then((post)=>{
			if(post)
			{
				post.comments.push(newcomment);
				post.save().then(()=>{
					console.log("saved");
				res.redirect(`/post/comment/${id}`);
				});
			}
			else
			console.log("err");
		});
	})
});

router.get('/upvote/:id',middleware.isLoggedIn,(req,res)=>{
	var userId=req.user._id;
	var postId=req.params.id;
    User.findById(userId).then((user)=>{
		if (!user)
		console.log("not found");
		if (_.includes(req.user.upvotedPosts, String(postId)))
		{
			console.log("already liked");
			res.redirect('/');
		}
		else
		{
			user.upvotedPosts.push(String(postId))
			user.save().then((data)=>{
				if (data)
				console.log("post liked and saved its id in user schema");
			});
			Post.findById(postId).then((post)=>{
				if(!post)
				console.log("not found");
				post.upvotes+=1;
				post.likedby.push(req.user._id);
				post.save().then(()=>{
					console.log(post.upvotes);
					res.redirect(`/`);
				})
			});
		}
    });
});

//post routes-------------------
router.get('/user/:username',middleware.isLoggedIn,(req,res)=>{
	username=req.user.username;
	res.render('username',{user:req.user});
})
router.get('/submit',middleware.isLoggedIn,(req,res)=>{
	res.render('submit',{user:req.user});
});
router.post('/submit',middleware.isLoggedIn,(req,res)=>{
	let title=req.body.ftitle;
	let url=req.body.furl;
	let text=req.body.ftext;
	let by=req.user;
	let name=req.user.username;
	let upvotes=0;
	if(!url&&text)
	{
		new Post({
			title,
			text,
			by,
			name,
			upvotes,
			section:"ask",
			text:"",
			url:""
		}).save().then((ask)=>{
			if(!ask)
				console.log("error saving question");
				else
				res.redirect('/ask');
		});
	}
	if(url && !text)
	{
		new Post({
			title,
			url,
			text:"",
			by,
			name,
			upvotes,
			section:"post"
		}).save().then((post)=>{
			if(!post)
				console.log("error saving post");
			else
			res.redirect('/');
		});
	}
	if(url && text)
	{
		new Post({
			title,
			url,
			text,
			by,
			name,
			upvotes,
			section:"show"
		}).save().then((show)=>{
			if(!show)
				console.log("error saving show");
				else
				res.redirect('/show');
		});
	}
});
router.get('/welcome',(req,res)=>{
	res.render('welcome',{user:req.user});
});

module.exports = router;




//voting system
// let like=true; let n=0;
// router.post('/post/like/:id',middleware.isLoggedIn,(req,res)=>{
// 	let id=req.params.id;
// 	if(like==false)
// 		{like=true;n--;}
// 	else
// 		{like=false;n++;}

// 	Vote.findOne({postid:id},(err,post)=>{
// 		if(post)
// 		{
// 			Vote.findOne({postid:id,'votes.by':req.user._id},(err,user)=>{
// 			if(user)
// 			{
// 				console.log(user);
// 				Vote.update(
// 				{postid:id,'votes.by':req.user._id},
// 			    {'$set':{'votes.$.like':like}},
// 			    (err,user)=>{
// 			    	if(err)
// 			    		console.log(err);
// 			    	else
// 			        	res.redirect("/");
// 			    });
// 			}
// 			else
// 			{
// 				Vote.findOneAndUpdate(
// 			    {postid:id},
// 			    {$push: {votes:{by:req.user._id,like:like}}},
// 			    {safe: true, upsert: true},
// 			    function(err, model) {
// 			        	res.redirect("/");
// 			    });
// 			}
// 			});
// 		}
// 		else
// 		{
// 			new Vote({
// 			postid:id,
// 			number:n,
// 			votes:{
// 				by:req.user._id,
// 				like:like
// 			}
// 			}).save().then((post)=>{
// 				res.redirect('/');
// 			});
// 		}
// 	});
// });