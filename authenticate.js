var authorization = {};
const Post=require('./models/postschema.js');
const Comment=require('./models/commentschema.js');

authorization.validuser= function(req,res,next){
     if(req.isAuthenticated()){
           Comment.findById(req.params.id,function(err,data){
                if(err){
                    res.redirect("/");
                } else{
                    if((data.by)==(req.user._id)){
                      console.log(data.by);
                      console.log(req.user._id);
                       next();    
                    }else{
                        res.redirect("/");
                    }
                }
            });
        }else{
            res.redirect("/");
        }
  };

authorization.isLoggedIn = function(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  console.log("login first");
  res.redirect("/auth/login");
};



module.exports= authorization;


