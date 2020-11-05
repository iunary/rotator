

module.exports = {

	requireAuth(req, res, next) {
		if(!req.session.userId){
			req.flash('error', "You need to be logged in to do that!");
			return res.redirect('/');
		}

		next();
	} 

};