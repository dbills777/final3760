const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Rec = require('./recipeModel');
const { render } = require('ejs');
const { result } = require('lodash');
const app = express();
const port = 3000;
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
//Set Veiw Engine
app.set('view engine', 'ejs');

// middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/', (req, res) => {
  Rec.find((err, recs) => {
    recs.forEach((element) => {
      console.log(element.ingredients);
    });
    if (err) {
      console.log(err);
    }
    res.render('index', { title: 'Home', recs });
  });
});
// app.get('/add-recipe', (req, res) => {
//   const recipe = new Rec({
//     name: 'This is another recipe',
//     ingredients: ['one', 'two', 'three', 'four', 'five', 'ingredients'],
//     directions: 'this is a list of directions for the new recipe',
//   });
//   recipe
//     .save()
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
app.post('/recipes', (req, res) => {
  const list = req.body.ingredients.split(',');
  console.log(req.body);
  console.log(req.body.ingredients, list);
  const recipe = new Rec({
    name: req.body.name,
    ingredients: list,
    directions: req.body.directions,
  });
  recipe
    .save()
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });

  // console.log(req.body);
  // console.log(req.body.ingredients.split(' '));
});
app.get('/recipes/:id', (req, res) => {
  const id = req.params.id;
  Rec.findById(id)
    .then((result) => {
      console.log('individual ingredient list', result.ingredients);
      res.render('details', { recipe: result, title: 'Recipe Details' });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.delete('/recipes/:id', (req, res) => {
  const id = req.params.id;
  Rec.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: '/' });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get('/create', (req, res) => {
  res.render('create', { title: 'Create a new recipe' });
});
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
