var express		= require("express"),
 	app			= express(),
	bodyParser	= require("body-parser"),
	mongoose 	= require('mongoose'),
	Campground	= require("./models/campground"),
	passport 	= require('passport'),
	methodOverride = require('method-override'),
	LocalStrategy = require('passport-local'),
	Comment		= require("./models/comment"),
	User		= require('./models/user'),
	seedDB		= require('./seeds');


mongoose.connect('mongodb+srv://arjun:siva@cluster0-qtiyg.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname+'/public'))

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

	console.log('Database successfully connected');
});

//seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
		secret: "arjun is hot",
		resave: false,
		saveUninitialized: false
		}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});
app.use(methodOverride("_method"));
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.listen(3000,function(){
	console.log("Yelpcamp started");
});