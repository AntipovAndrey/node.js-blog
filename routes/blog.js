const express = require('express');
const router = express.Router();
const Blog = require('../repository/blog');


router.get('/', (req, res, next) => {
    Blog.find({})
        .then(blogs => {
            res.render('index', {
                blogs: blogs
            });
        })
        .catch(next);

});

router.get('/new', (req, res) => {
    res.render('new');
});

router.post('/', (req, res, next) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog)
        .then(newBlog => {
            res.redirect(`${req.baseUrl}/${newBlog._id}`);
        })
        .catch(next)
});

router.get('/:id', (req, res, next) => {
    if (!Blog.isObjectId(req.params.id)) {
        next();
        return;
    }
    Blog.findById(req.params.id)
        .then(blog => {
            if (!blog) {
                next();
                return;
            }
            res.render('show', {
                blog: blog
            });
        })
        .catch(next);
});

router.get('/:id/edit', (req, res, next) => {
    if (!Blog.isObjectId(req.params.id)) {
        next();
        return;
    }
    Blog.findById(req.params.id)
        .then(blog => {
            if (!blog) {
                next();
                return;
            }
            res.render('edit', {
                blog: blog
            });
        })
        .catch(next);
});

router.put('/:id/edit', (req, res, next) => {
    if (!Blog.isObjectId(req.params.id)) {
        next();
        return;
    }
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog)
        .then(updatedBlog => {
            if (!updatedBlog) {
                next();
                return;
            }
            res.redirect(`${req.baseUrl}/${updatedBlog._id}`);
        })
        .catch(next);
});

router.delete('/:id', (req, res, next) => {
    if (!Blog.isObjectId(req.params.id)) {
        next();
        return;
    }
    Blog.findByIdAndDelete(req.params.id)
        .then(() => res.redirect(req.baseUrl + '/'))
        .catch(next);
});

module.exports = router;
