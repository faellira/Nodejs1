const express = require('express');
const app = express();
const BodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const UsersController = require('./users/UsersController');

const Category = require('./categories/Category');
const Article = require('./articles/Article');
const User = require('./users/User');

//Database connection
connection.
authenticate()
.then(()=>{
    console.log('Conexão com banco de dados feita com sucesso!');
}).catch(err => {console.log(err);});

//setting view engine and static assets
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({
    secret: 'dlofngpousjfpdfa',
    cookie: {maxAge: 30000000}
    })
);

//body parser for forms
app.use(BodyParser.urlencoded({ extended:false }));
app.use(BodyParser.json());

//Controller of routes for pages
app.use('/', 
categoriesController,
articlesController,
UsersController,);


app.get('/', (req, res) => {
    Article.findAll({
        order: [['id', 'DESC']],
        include :[{model : Category}],
        limit: 4}
        ).then(articles =>{
            Category.findAll().then(categories => {
                res.render('index', {articles: articles, categories : categories});
            })
        
    })
    
})

app.get('/:slug', (req, res) => {
    let slug = req.params.slug;

    Article.findOne({
        where: {slug : slug},
        include: [{model : Category}]
    }).then(article => {
        if (article != undefined){
            Category.findAll().then(categories => {
                res.render('article', {article: article, categories : categories});
            })
        } else {
            res.redirect('/')
        }
    }).catch( err => {
        res.redirect('/')
    })
})  

app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug;

    Category.findOne({
        where: {slug : slug},
        include: [{model : Article}]
    }).then( category => {
        if(category != undefined){
        Category.findAll({
            include: [{model : Article}]
        }).then(categories => {
            res.render('index', {articles : category.articles, categories : categories});
        })
        } else{
            res.redirect('/');
        }
    }).catch(err => res.redirect('/'))
})

//starting up server on port 8080
app.listen(8080, (req, res) => {
    console.log('|Servidor inicializado...localhost:8080/|')
})