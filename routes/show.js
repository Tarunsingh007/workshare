const express = require('express');
const router = express.Router();
const User=require('../models/userschema.js');
const passport=require('passport');
const passportconfig=require('../config/passportconfig.js');
const middleware=require('../authenticate.js');
const Post=require('../models/postschema.js');
const Comment=require('../models/commentschema.js');
const _=require('lodash');
var sz=4;
//show route
router.get('/',(req,res)=>{
	var pg=parseInt(req.query.pg);
	var query={};
	query.skip=sz*(pg-1);
	query.limit=sz;
	Post.count({section:"show"},function(err,c){
		var totalpages=Math.ceil(parseFloat(c/sz));
	Post.find({section:"show"},{},query).then((show)=>{
		if(!show)
			console.log("no questions");
    res.render('show',{user:req.user,show:show,pg:totalpages});
	});
});
});

// //comment routes----------------
// router.get('/comment/delete/:id',middleware.validuser,(req,res)=>{
// 	let id=req.params.id;
// 	Comment.findOne({_id:id}).then((post)=>{
// 		Comment.deleteOne({_id:id}).then((done)=>{
// 			console.log(done);
// 		res.redirect(`/show/comment/${post.postid}`);
// 		})
// 	});
// });
// router.get('/comment/update/:id',middleware.validuser,(req,res)=>{
// 	Comment.findById(req.params.id).then((com)=>{
// 	res.render('updatecomment',{commentid:req.params.id,data:com.comment});
// 	});
// });

// router.put('/comment/update/:id',(req,res,next)=>{
//    Comment.findOneAndUpdate({_id:req.params.id},{comment:req.body.comm},(err,comment)=>{
//       if(err)
//          return err;
//       else
//        	res.redirect('/show/comment/'+comment.postid);
//    });
// });
// router.get('/comment/:id',(req,res)=>{
// 	let id=req.params.id;
// 	Comment.find({postid:id}).then((comment)=>{
// 	Show.findById(id).then((post)=>{
// 		res.render('showcomment',{comments:comment,
// 							  post:post,
// 							  postid:id,
// 							  user:req.user});
// 		});
// 	});
// });
// router.post('/comment/:id',middleware.isLoggedIn,(req,res)=>{
// 	let id=req.params.id;
// 	let comment=req.body.com;
// 	var newcomment=new Comment({
// 		comment:comment,
// 		by:req.user._id,
// 		postid:id,
// 		noc:req.user.username
// 	})
// 	newcomment.save().then((comment)=>{
// 		if(!comment)
// 			console.log(err);
// 		Show.findOne({_id:id}).then((post)=>{
// 			if(post)
// 			{
// 				post.com.push(newcomment);
// 				post.save().then(()=>{
// 					console.log("saved");
// 				res.redirect(`/show/comment/${id}`);
// 				});
// 			}
// 			else
// 			console.log("err");
// 		});
// 	})
// });

// router.post('/upvote/:id',(req,res)=>{
// 	var userId=req.user._id;
// 	var postId=req.params.id;
//     User.findById(userId).then((user)=>{
// 		if (!user)
// 		console.log("not found");
// 		if (_.includes(req.user.upvotedPosts, String(postId)))
// 			{console.log("already liked");res.redirect('/show')}
// 		else
// 		{
// 			user.upvotedPosts.push(String(postId))
// 			user.save().then((data)=>{
// 				if (data)
// 				console.log("post liked and saved its id in user schema");
// 			});
// 			Show.findById(postId).then((post)=>{
// 				if(!post)
// 				console.log("not found");
// 				post.upvotes+=1;
// 				post.save().then(()=>{
// 					console.log(post.upvotes);
// 					res.redirect('/show');
// 				})
// 			});
// 		}
//     });
// });

module.exports = router;