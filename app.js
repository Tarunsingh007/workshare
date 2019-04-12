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
const Humanize=require('./config/date').Humanize;


var indexRouter = require('./routes/index');
var authRouter=require('./routes/auth');
var askRouter=require('./routes/ask');
var showRouter=require('./routes/show');
var app = express();

hbs.registerHelper('list', function(items, o, options) {
  var out='<div class="table-responsive"><table class="table table-hover table-condensed" bgcolor="#f6f6ef">';
  s=o;
  for(var i=0; i<items.length; i++) {
    out = out+'<tr style="height:0px; padding:0px; margin:0px;" >'+'<td id="votelink" align="right" valign="top">'+ ++s +"." +'</td>'+'<td width="1100px">'+options.fn(items[i])+'</td>'+'</tr>';
  }
  return out +'</table></div>';
});

hbs.registerHelper('humanize', function(date) {
  var hum = new Humanize(date);
  return hum.humanizeDate();
});

hbs.registerHelper('isEqual', function(obj1, obj2) {
  return obj1.equals(obj2);
});

hbs.registerHelper('indexpaginate', function(o){
  var out='';
  for(let i=1; i<=o; i++)
  {
    out=out+'<button id="posta" style="font-size:10pt;">'+`<a href="/?pg=${i}">`+i+'</a></button>';
  }return out;
});

hbs.registerHelper('showpaginate', function(o){
  var out='';
  for(let i=1; i<=o; i++)
  {
    out=out+'<button id="posta" style="font-size:10pt;">'+`<a href="/show/?pg=${i}">`+i+'</a></button>';
  }return out;
});

hbs.registerHelper('askpaginate', function(o){
  var out='';
  for(let i=1; i<=o; i++)
  {
    out=out+'<button id="posta" style="font-size:10pt;">'+`<a href="/ask/?pg=${i}">`+i+'</a></button>';
  }return out;
});

hbs.registerHelper('trendingpaginate', function(o){
  var out='';
  for(let i=1; i<=o; i++)
  {
    out=out+'<button id="posta" style="font-size:10pt;">'+`<a href="/trending/?pg=${i}">`+i+'</a></button>';
  }return out;
});

hbs.registerHelper('allowLike', function(obj1, obj2) {
  for(var i=0; i<obj2.length; i++)
  {
    var l=obj1.toString();
    var r=obj2[i].toString();
    if(l==r)
    return true;
  }
});

hbs.registerHelper('countComments', function(com) {
  return com.length;
})

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
  valid:1000,
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
app.use('/auth', authRouter);
app.use('/show', showRouter);
app.use('/ask', askRouter);

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
// +'<td><center><a><div valign="top" id="votearrow"></div></a></center></td>'