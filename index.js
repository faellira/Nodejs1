const express = require('express');
const app = express();
const BodyParser = require('body-parser');
const connection = require('./database/database');
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

const Category = require('./categories/Category');
const Article = require('./articles/Article');

//Database connection
connection.
authenticate()
.then(()=>{
    console.log('Conexão com banco de dados feita com sucesso!');
}).catch(err => {console.log(err);});

//setting view engine and static assets
app.set('view engine', 'ejs');
app.use(express.static('public'));

//body parser for forms
app.use(BodyParser.urlencoded({ extended:false }));
app.use(BodyParser.json());

//Controller of routes for pages
app.use('/', 
categoriesController,
articlesController);

app.get('/', (req, res) => {
    res.render('index')
})

//starting up server on port 8080
app.listen(8080, (req, res) => {
    console.log('|Servidor inicializado...localhost:8080/|')
})