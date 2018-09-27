const express = require('express');
const router = express.Router();
const Blog = require('../repository/blog');


/* GET home page. */
router.get('/', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                blogs: blogs
            });
        }
    });
});

router.get('/new', (req, res) => {
    res.render('new');
});

router.post('/', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.redirect(req.baseUrl + '/new')
        } else {
            res.redirect(`${req.baseUrl}/${newBlog._id}`);
        }
    })
});

router.get('/:id', (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            res.redirect(req.baseUrl + '/');
        } else {
            res.render('show', {
                blog: blog
            });
        }
    })
});

router.get('/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            res.redirect(`${req.baseUrl}/${req.params.id}/edit`);
        } else {
            res.render('edit', {
                blog: blog
            });
        }
    })
});

router.put('/:id/edit', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            res.redirect('/');
        } else {
            res.redirect(`${req.baseUrl}/${updatedBlog._id}`);
        }
    });
});

router.delete('/:id', (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.redirect(req.baseUrl + '/');
        } else {
            res.redirect(req.baseUrl + '/');
        }
    });
});

module.exports = router;
