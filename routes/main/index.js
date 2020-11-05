const express = require('express');
const router = express.Router();
const Links = require('../../models/url');
const randomizer = require('../../utils/randomizer');
const urlChecker = require('../../utils/urlChecker');
const isArray = require('../../utils/helper');
const { requireAuth } = require('../../utils/middleware');
const tbodyTemplate = require('../../views/template/template');

// dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
    try{

      const links = await Links.find({ isArchive: false });

      if(links.length === 0){
        res.locals.title = "Dashboard - Spinster URL Rotator";
        return res.render('links/index', { links: links });      
      }

      const tbody = tbodyTemplate( links, 'dashboard' );      
      res.locals.title = "Dashboard - Spinster URL Rotator";
      res.render('links/index', { links: tbody });

    }catch(e) {
      req.flash('error', 'Something went wrong, please try again!');
      res.redirect('/dashboard');
    }
});


// create route
router.get('/create', requireAuth, async (req, res) => {
  try{
      res.locals.title = "Create Link - Spinster URL Rotator";
      res.render('links/create');
    }catch(e) {
      req.flash('error', 'Something went wrong, please try again!');
      res.redirect('/dashboard');
    }
});


router.post('/create', requireAuth, async (req, res) => {

    try{

      let { name, url: urlArr, perc: percArr } = req.body;

      const fullObj = await isArray(name, urlArr, percArr);

      await Links.create(fullObj);
      
      req.flash('success', 'Link created!');
      res.redirect('/dashboard');

    }catch(e) {
      req.flash('error', 'Something went wrong, please try again!');
      res.redirect('/create');
    }

});




// edit route
router.get('/links/:link/edit', requireAuth, async (req, res) => {
    try{

      const id = req.params.link;
      const link = await Links.find({ short: id });
      
      res.locals.title = "Edit Link - Spinster URL Rotator";
      res.render('links/edit', { link: JSON.stringify(link[0]) });      

    }catch(e) {
      req.flash('error', 'Something went wrong, please try again!');
      res.redirect('/dashboard');
    }
});

router.put('/links/:link', requireAuth, async (req, res) => {
    const id = req.params.link; 

    try{
      let { name, url: urlArr, perc: percArr } = req.body;
      const fullObj = await isArray(name, urlArr, percArr);
      const data = await urlChecker(id, fullObj);
      const link = await Links.findOneAndUpdate({ short: id }, data, { new: true, runValidators: true });

      if(!link) {
        throw new Error('Resource not found!');
      }

      req.flash('success', 'Link updated!');
      res.redirect('/dashboard');

    }catch(e) { 
      req.flash('error', 'Something went wrong, please try again!');
      res.redirect(`/links/${id}/edit`);
    }
});



// delete route
router.delete("/delete/:link", requireAuth, async (req, res) => {
    try{
      const id = req.params.link;
      const link = await Links.findOneAndDelete({ short: id });

      if (!link || link == null) {
        throw new Error('Resource not found!');
      }

      req.flash('success', 'Link deleted!');
      res.redirect('/dashboard');
    }catch(e){
      req.flash('error', 'Something went wrong, please try again!');
      res.redirect('/dashboard');
    }
});

// get url
router.get('/:link', async (req, res) => {
    try{
      const id = req.params.link;

      const link = await Links.find({ short: id });

      if (!link || link == null || link == undefined || link === "") {
        res.locals.title = "404 Link Not Found - Spinster URL Rotator";
        return res.status(404).render('template/error', { error: "Check the url and try again!" });
      }


      const randData = await randomizer(link[0]);

      if(!randData){
        res.locals.title = "404 Link Not Found - Spinster URL Rotator";
        return res.status(404).render('template/error', { error: "Check the url and try again!" });
      }


      link[0].name = randData.updated.name;
      link[0].clicks = randData.updated.clicks;
      link[0].full = randData.updated.full;

      await link[0].save();

      res.redirect(randData.redirectedUrl);

    }catch(e) {
      res.locals.title = "404 Link Not Found - Spinster URL Rotator";
      res.status(404).render('template/error', { error: "Make sure the link is correct and try again!" });
    }
});


module.exports = router;