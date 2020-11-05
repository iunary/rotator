const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const { requireAuth } = require('../../utils/middleware');


// login page
router.get('/', async(req, res) => {
	try{
		res.locals.title = "Admin Login - Spinster URL Rotator";
    	if(req.session.userId){
			return res.redirect('/dashboard');
		}
		res.render('auth/login');
	}catch(e) {
		req.flash('error', 'Somthing went wrong, please try again!');
		res.redirect('/');
	}
    
});


router.post('/login', async (req, res) => {
	try{
		const { username, password } = req.body;

	  	const user = await User.findOne({ username }).select('+password');

	    if(!user) {
	        req.flash('error', "User doesn't exist!");
			return res.redirect('/');
	    }

	    // Check if Password matches
		const isMatch = await user.matchPassword(password);
	        
	    if(!isMatch) {
	        req.flash('error', 'Incorrect username or password!');
			return res.redirect('/');
	    }

	  	req.session.userId = user.id;
	  	req.session.user = user;

		req.flash('success', `Welcome, ${req.session.user.username}!`);
	  	res.redirect('/dashboard');
	}catch(e) {
		req.flash('error', 'Somthing went wrong, please try again!');
		res.redirect('/');
	}
  	
})

// reset credentials

router.get('/settings', requireAuth, async(req, res) => {
	try{
		res.locals.title = "Settings - Spinster URL Rotator";
    	const username = req.session.user.username;
		res.render('auth/settings', { username: username });
	}catch(e) {
		req.flash('error', 'Somthing went wrong, please try again!');
		res.redirect('/settings');
	}
    
});

router.put('/reset', requireAuth, async(req, res) => {
    try{
		const { username, oldPassword, newPassword } = req.body;

	  	const user = await User.find().select('+password');

	    if(user.length === 0) {
	        req.session = null;
  			return res.redirect('/');
	    }

	    // Check if Old Password matches
		const isMatch = await user[0].matchPassword(oldPassword);
	        
	    if(!isMatch) {
	        req.flash('error', 'Incorrect old password!');
			return res.redirect('/settings');
	    }


	    user[0].username = username;
	    user[0].password = newPassword;


	    await user[0].save();

	  	req.session.userId = user[0].id;
	  	req.session.user = user[0];

		req.flash('success', 'Username & Password updated');
	  	res.redirect('/settings');
	}catch(e) {
		req.flash('error', 'Somthing went wrong, please try again!');
		res.redirect('/settings');
	}
});


// Sign Out Route
router.get('/logout', (req, res) => {
  	req.session = null;
  	res.redirect('/');
})


router.get('/session/destroy', function(req, res) {
  	req.session = null;
    res.status(200).send('ok');
});

module.exports = router;
