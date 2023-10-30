const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('../articles/Article');
const slugify = require('slugify');

router.get('/admin/articles', (req, res) =>{
    Article.findAll({include: [{model: Category}]}).then(articles => {
        res.render('admin/articles/index', {articles : articles})
    }); 
})

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories =>{
        res.render('admin/articles/new', {categories : categories})
    })
})

router.post('/articles/save', (req, res) =>{
    let title = req.body.title;
    let category = req.body.selectCategories;
    let bodyArticle = req.body.articleBody;

        Article.create({
            title: title,
            slug: slugify(title),
            body: bodyArticle,
            categoryId: category  
        }).then(() =>{
            res.redirect('/admin/articles')
        });
})


module.exports = router;