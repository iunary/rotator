const express = require('express');
const router = express.Router();
const Links = require('../../models/url');
const { requireAuth } = require('../../utils/middleware');
const tbodyTemplate = require('../../views/template/template');


// get route
router.get('/archive', requireAuth, async (req, res) => {
    try{

      const links = await Links.find({ isArchive: true });

      if(links.length === 0){
        res.locals.title = "Archive - Spinster URL Rotator";
        return res.render('archive/index', { links: links });      
      }

      const tbody = tbodyTemplate( links, 'archive');      
      res.locals.title = "Archive - Spinster URL Rotator";  
      res.render('archive/index', { links: tbody });
    }catch(e) {
        req.flash('error', 'Something went wrong, please try again!');
        res.redirect('/dashboard');
    }
});



// update route
router.put("/archive/:link", requireAuth, async (req, res) => {
    try{
        const id = req.params.link;
        const link = await Links.findOneAndUpdate({ short: id }, { isArchive: true }, { new: true, runValidators: true });

        if (!link || link == null) {
          throw new Error('Resource not found!');
        }

        req.flash('success', 'Link moved to archive!');
        res.redirect('/dashboard');
    }catch(e){
        req.flash('error', 'Something went wrong, please try again!');
        res.redirect('/dashboard');
    }
});

// delete route
router.delete("/archive/delete/:link", requireAuth, async (req, res) => {
    try{
        const id = req.params.link;
        const link = await Links.findOneAndDelete({ short: id });

        if (!link || link == null) {
          throw new Error('Resource not found!');
        }

      req.flash('success', 'Link deleted permanently!');
      res.redirect('/archive');
    }catch(e){
      req.flash('error', 'Something went wrong, please try again!');
        res.redirect('/archive');
    }
});

// restore route
router.put("/archive/restore/:link", requireAuth, async (req, res) => {
    try{
        const id = req.params.link;
        const link = await Links.findOneAndUpdate({ short: id }, { isArchive: false }, { new: true, runValidators: true });

        if (!link || link == null) {
          throw new Error('Resource not found!');
        }

        req.flash('success', 'Link restored!');
        res.redirect('/archive');
    }catch(e){
        req.flash('error', 'Something went wrong, please try again!');
        res.redirect('/archive');
    }
});


module.exports = router;
