
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const mongoose = require("mongoose");
const User = require('./models/users');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const methodOverride   = require('method-override');


const indexRoutes = require('./app/routes/index');
const usersRoutes = require('./app/routes/users');
const hooksRoutes=require('./app/routes/hooks');
const app = express();

const HTTP_PORT = process.env.PORT || 8000;
// mongoose.connect('mongodb://127.0.0.1/openfarmtwilio' , { useNewUrlParser: true });
mongoose.connect(process.env.DATABASE , { useNewUrlParser: true });

mongoose.Promise = global.Promise;
app.locals.moment = require("moment");
app.use(require('express-session')({
    secret: 'Agriworld application DB Secret',
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");  
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(indexRoutes);
app.use(usersRoutes);
app.use(hooksRoutes);



// Listen for HTTP Connection
app.listen(HTTP_PORT, () => {
	console.log(`App is running on HTTP PORT ${HTTP_PORT}`);
});
