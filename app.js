const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Rec = require('./recipeModel');
const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require('dotenv').config();

mongoose
  .connect(`${process.env.MONGOURL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) =>
    app.listen(process.env.PORT || port, () =>
      console.log(`"Static Recipe App Listening at ${port}`)
    )
  )
  .catch((err) => console.log(err));

app.set('view engine', 'ejs');

// middleware
// app.use((req, res, next) => {
//   console.log('new request made:');
//   console.log('host: ', req.hostname);
//   console.log('path: ', req.path);
//   console.log('method: ', req.method);
//   next();
// });
// app.use(morgan('dev'));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/', (req, res) => {
  
  Rec.find((err, recs)=>{
    if(err){
      console.log(err)
    }
    // res.json(recs)
    res.render('index', { title: 'Home', recs });
  })
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/recipes/create', (req, res) => {
  res.render('create', { title: 'Create a new recipe' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
