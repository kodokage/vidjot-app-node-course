const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');



const app = express();


//Passport config
require('./config/passport')(passport);


//Remove mongoose deprecation warning
mongoose.Promise = global.Promise;

//connect to mongodb
mongoose.connect('mongodb://localhost/vidjot-dev', {useNewUrlParser:true})
.then(()=> console.log('Mongodb connected'))
.catch(err => console.log(err));

//Load Idea model
const Idea = require('./models/Idea');

//Handlebars view middleware
app.engine('handlebars', expressHandlebars({
    defaultLayout:'main'
}));
//app.use(expressHandlebars);
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override middlewar
app.use(methodOverride('_method'));

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

  app.use(flash());

  //Global variables
  app.use(function(req, res, next){
      res.locals.success_msg = req. flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      res.locals.user = req.user || null;
      next();
  })


////////Routes/////////////////////////////////////////////

//index Route
app.get('/', (req, res)=>{
    const title = 'Welcome'
    res.render('index', {
        title:title
    });
});

//About Route
app.get('/about',(req, res)=>{
    res.render('about');
});


app.use('/ideas', require('./routes/ideas'));
app.use('/users', require('./routes/users'));



//Use static files
app.use(express.static('public'));

const Port = 8000;

app.listen(Port, ()=>{
    console.log(`Server started on port ${Port}`);
    
});