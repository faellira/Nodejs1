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

router.post('/articles/delete', (req, res) =>{
    let id = req.body.id;

    if(id != undefined) {
        if(!isNaN(id)){
            Article.destroy({
                where: {id : id}
            }).then(() => res.redirect('/admin/articles'))
        } else{
            res.redirect('/admin/articles');
        }
    } else {
        res.redirect('/admin/articles');
    }
    
})

router.get('/admin/articles/edit/:id', (req, res)=>{
    let id = req.params.id;
    Article.findByPk(id, {include: [{model: Category}]}).then(article => { 
        if(isNaN(id)){res.redirect('/admin/articles')}

        if (article != undefined){
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {article : article, categories: categories});
            }) 
            
        } else {
            res.redirect('/admin/articles');
        }
    }).catch(error => res.redirect('/admin/articles'))
})

router.post('/articles/update', (req, res) =>{
    let id = req.body.id;
    let title = req.body.title;
    let articleBody = req.body.articleBody;
    let category = req.body.selectCategories;

    Article.update({title : title,slug : slugify(title), body: articleBody, categoryId : category },{
        where:{
            id : id
        }
    }).then(()=> {
        res.redirect('/admin/articles');
    })
})
module.exports = router;