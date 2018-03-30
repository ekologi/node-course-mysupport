const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const assert = require('assert');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./config/database');

//global promise
mongoose.Promise = global.Promise;
//connect to database
mongoose.connect(db.mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('Error connected to DB'));

//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//static PUBLIC , utk CSS dkk
app.use(express.static(path.join(__dirname, 'public')));

//index router 
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Welcome'
    });
});

//about router 
app.get('/api/:id', (req, res) => {
    //res.render('about');
});


app.post('/api/test', (req, res) => {
    //FREELANCER NEW CODE
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


