const express = require('express');
const router = express.Router();
const User=require('../models/userschema.js');
const passport=require('passport');
const passportconfig=require('../config/passportconfig.js');
const middleware=require('../authenticate.js');
const Post=require('../models/postschema.js');
const Comment=require('../models/commentschema.js');
const Vote=require('../models/voteschema.js');
const Ask=require('../models/askschema.js');
const Show=require('../models/showschema.js');

router.get('/',(req,res)=>{
	Post.find().limit(12).then((post)=>{
		if(!post)
			console.log("no posts");
    res.render('index',{user:req.user,posts:post});
	});
});
router.get('/more',(req,res)=>{
	Post.find().then((post)=>{
		if(!post)
			console.log("no posts");
    res.render('index',{user:req.user,posts:post});
	});
});
//hide post route
router.get('/post/hide/:id',middleware.isLoggedIn,(req,res)=>{
	let id=req.params.id;
	
});
//new post route
router.get('/new',(req,res,next)=>{
	res.render('error');
});
//ask route
router.get('/ask',(req,res)=>{
	Ask.find().then((ask)=>{
		if(!ask)
			console.log("no questions");
    res.render('ask',{user:req.user,ask:ask});
	});
});
//show route
router.get('/show',(req,res)=>{
	Show.find().then((show)=>{
		if(!show)
			console.log("no questions");
    res.render('show',{user:req.user,show:show});
	});
});





//comment routes----------------
router.get('/post/comment/delete/:id',middleware.validuser,(req,res)=>{
	let id=req.params.id;
	Comment.findOne({_id:id}).then((post)=>{
		Comment.deleteOne({_id:id}).then((done)=>{
			console.log(done);
		res.redirect(`/post/comment/${post.postid}`);
		})
	});
});
router.get('/post/comment/update/:id',middleware.validuser,(req,res)=>{
	res.render('updatecomment',{commentid:req.params.id})
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
	new Comment({
		comment:comment,
		by:req.user._id,
		postid:id,
		noc:req.user.username
	}).save().then((comment)=>{
		if(!comment)
			console.log(err);
		else
			res.redirect(`/post/comment/${id}`);
	})
});
//voting system
// router.post('/post/like/:id',(req,res)=>{
// 	let id=req.params.id;
// 	let like=0;
// 	new Vote({
// 		vote:++like
// 	}).save().then((done)=>{
// 		if(done)
// 	res.redirect('/');	
// 	});
// });

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
	let by=req.user._id;
	let name=req.user.username;
	if(!url&&text)
	{
		new Ask({
			title,
			text,
			by,
			name
		}).save().then((ask)=>{
			if(!ask)
				console.log("error saving question");
			res.redirect('/ask');
		});
	}
	if(url && !text)
	{
		new Post({
			title,
			url,
			by,
			name
		}).save().then((post)=>{
			if(!post)
				console.log("error saving post");
			res.redirect('/');
		});
	}
	if(url && text)
	{
		new Show({
			title,
			url,
			text,
			by,
			name
		}).save().then((show)=>{
			if(!show)
				console.log("error saving show");
			res.redirect('/show');
		});
	}
});
router.get('/welcome',(req,res)=>{
	res.render('welcome',{user:req.user});
});

module.exports = router;
