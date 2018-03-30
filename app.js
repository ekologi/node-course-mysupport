const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const mongoose = require('mongoose');
const assert = require('assert');
const app = express();
const expressValidator = require('express-validator');
const Session = require('express-session'); 
const flash = require('connect-flash');
const port = process.env.PORT || 3000;
const db = require('./config/database');
//load IDEAS
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//passport config
require('./config/passport')(passport);

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


//method-override
app.use(methodOverride('_method'));
//body parser
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

// Express session midleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());
app.use(flash());

//variable global
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
//static PUBLIC , utk CSS dkk
app.use(express.static(path.join(__dirname, 'public')));

//index router 
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Selamat Datang di Aplikasi Support'
    });
});

//about router 
app.get('/about', (req, res) => {
    res.render('about');
});

app.post('/api/test', function (req, res) {
    //var user_id = req.body.id;
    //var token = req.body.token;
    //console.log(typeof(req.body));
    //var geo = req.body.geo;
    //var invmst_no = JSON.stringify(req.body.invmst_no_inv);
    
    var obj = req.body;

    var str = JSON.stringify(obj);

    var substr = str.substring(2, str.length - 5).replace(/[\\\n]/g, "");

    //ganti ":{" dengan [
    var ret = substr.replace('":{"', "[");
    //buang " karena ada sisa "(tanda petik)
    var substr2 = ret.substring(0, ret.length - 1);

    //tambahkan ]}} 
    var substr3 = substr2 + "]}}";
    var jsonstr = JSON.parse(substr3);

    res.send(jsonstr);
    //res.send(substr);
    // //console.log(obj);
    // var n = substr.indexOf("data");
    // var substr2 = substr.substring(0, n+6);
    // var substr3 = substr.substring(n + 11, substr.length-1);
    // var substr4 = substr2 + "[" + substr3 + "]}";

    // var jsonstr = JSON.parse(substr4);

    // res.send(jsonstr);

    

});


// Use routes
app.use('/ideas',ideas); 
app.use('/users', users); 

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


