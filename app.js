var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
const passport=require('passport');
const cookieSession=require('cookie-session');
const mongoose=require('mongoose');
const hbs=require('hbs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter=require('./routes/auth');
var app = express();
// hbs.registerHelper('list', function(items, options) {
//   var out=" ";
//   for(var i=1, l=items.length; i<=l; i++) {
//     out = out+'<div class="row">'+'<div class="col-sm-1" id="post1">'+ i +"</div>"+'<div class="col-sm-11" id="post">'+options.fn(items[i])+'</div>'+'</div>';
//   }

//   return out ;
// });
hbs.registerHelper('list', function(items, options) {
  var out='<table bgcolor="#f6f6ef" class="table-bordered table-hover" id="table">';
  var s=0;
  for(var i=0, l=items.length; i<l; i++) {
    out = out+'<tr>'+'<td width="50px">'+ ++s +"." +'</td>'+'<td width="1100px">'+options.fn(items[i])+'</td>'+'</tr>';
  }

  return out +'</table>';
});
//mongoose setup
mongoose.connect("mongodb://localhost/hackernews",(err)=>{
	if(err)
		console.log(err);
	else
		console.log("connected to database");
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
//cookie
app.use(cookieSession({
  valid:50000,
  keys:['asdsd']
}));

//passport
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
//middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
