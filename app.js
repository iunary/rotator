const express 			= require("express");
const dotenv 			= require('dotenv');
const app 				= express();
const port 				= process.env.PORT || 3000
const cookieSession 	= require('cookie-session');
const flash 			= require('connect-flash');
const adminRouter 		= require('./routes/admin/auth');
const archiveRouter 	= require('./routes/archive/archive');
const mainRouter 		= require('./routes/main/index');
const connectDB	 		= require('./config/db');
const colors	 		= require('colors');
const methodOverride 	= require("method-override");
const accountSeeder 	= require('./utils/seeder');

// Load Env Variables
dotenv.config();

// Connect to DB
connectDB();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
  keys: [process.env.SECRET_KEY]
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});
app.locals.moment = require('moment');
app.use(methodOverride("_method"));


app.use(adminRouter);
app.use(archiveRouter);
app.use(mainRouter);


app.use(function (req, res) {
	res.locals.title = "404 Page Not Found - Spinster URL Rotator";
    res.status(404).render('template/error', { error: null });
});


accountSeeder();
app.listen(port, () => {
	console.log(`Server running on port: ${port}`.red);
});