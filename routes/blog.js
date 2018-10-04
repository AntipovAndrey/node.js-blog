const express = require('express');
const router = express.Router();
const Blog = require('../model/blog');
const ifLoggedIn = require('./general/auth').ifLoggedIn('/login');
const {isLoggedIn} = require('./general/auth');

router.get('/', (req, res, next) => {
    Blog.find({})
        .then(blogs => {
            res.render('index', {
                blogs: blogs
            });
        })
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    if (!Blog.isObjectId(req.params.id)) {
        return next();
    }
    Blog.findById(req.params.id)
        .then(blog => {
            if (!blog) {
                return next();
            }
            res.render('show', {
                blog: blog,
                canModify: isLoggedIn(req) && blog.author.id.equals(req.user._id)
            })
        })
        .catch(next);
});

router.get('/new', ifLoggedIn, (req, res) => {
    res.render('new');
});

router.post('/', ifLoggedIn, async (req, res, next) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    const blog = await Blog.create(req.body.blog);
    blog.author.id = req.user._id;
    blog.author.username = req.user.username;
    blog.save();
    res.redirect(`${req.baseUrl}/${blog._id}`);
});

const ifPermitted = (req, res, next) => {
    const fail = () => res.redirect('/login');
    if (isLoggedIn(req)) {
        Blog.findById(req.params.id)
            .then(blog => {
                if (!blog) {
                    return next();
                }
                if (blog.author.id.equals(req.user._id)) {
                    return next();
                }
                res.status(403).send();
            })
            .catch(next);
    } else {
        fail();
    }
};

router.get('/:id/edit', ifPermitted, (req, res, next) => {
    if (!Blog.isObjectId(req.params.id)) {
        return next();
    }
    Blog.findById(req.params.id)
        .then(blog => {
            if (!blog) {
                return next();
            }
            res.render('edit', {
                blog: blog
            });
        })
        .catch(next);
});

router.put('/:id/edit', ifPermitted, (req, res, next) => {
    if (!Blog.isObjectId(req.params.id)) {
        return next();
    }
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog)
        .then(updatedBlog => {
            if (!updatedBlog) {
                return next();
            }
            res.redirect(`${req.baseUrl}/${updatedBlog._id}`);
        })
        .catch(next);
});

router.delete('/:id', ifPermitted, (req, res, next) => {
    if (!Blog.isObjectId(req.params.id)) {
        return next();
    }
    Blog.findByIdAndDelete(req.params.id)
        .then(() => res.redirect(req.baseUrl + '/'))
        .catch(next);
});

module.exports = router;
