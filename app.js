const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Rec = require('./recipeModel');
const { render } = require('ejs');
const { result } = require('lodash');
const { update } = require('./recipeModel');
const app = express();
const port = 3000;
mongoose.set('useFindAndModify', false);
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
// GET ROOT PAGE
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
//POST A NEW RECIPE//
app.post('/recipes', (req, res) => {
  const list = req.body.ingredients.split(',');
  const shoplist = list.map((item) => {
    return { complete: false, item: item, quantity: 1};
  });
  console.log(shoplist);

  console.log(req.body);
  console.log(req.body.ingredients, list);
  const recipe = new Rec({
    name: req.body.name,
    ingredients: list,
    directions: req.body.directions,
    shopping: shoplist,
    
  });

  recipe
    .save()
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
});
//GET ONE SPECIFIC RECIPE
app.get('/recipes/:id', (req, res) => {
  const id = req.params.id;
  Rec.findById(id)
    .then((result) => {
      console.log('individual ingredient list', result.ingredients);
      console.log(result.shopping);
      res.render('details', { recipe: result, title: 'Recipe Details' });
    })
    .catch((err) => {
      console.log(err);
    });
});
//DELETE ONE RECIPE
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

app.put('/recipes/:update/:id', (req, res) => {
  const id = req.params.id
  const update = req.params.update
  Rec.findByIdAndUpdate(id, { new: true }, (err, rec) => {
    console.log('545456',rec)
    rec.name = update
    rec.save().then((result)=>{
      res.json({redirect: `/recipes/${id}`})
    })

    // Rec.updateOne(req.query, (err, rec) => {
    //   console.log(rec);
    //   rec.name = req.query.name
    //   console.log(req.params,'5454665');
    //   if (err) {
    //     console.log(err);
    //   }
    //   Rec.find((err, rec) => {
    //     if (err) {
    //       console.log(err);
    //     }
    //     res.json(rec);
    //   });
    // });
  });
});
//GET CREATE NEW RECIPE PAGE IN NAV
app.get('/create', (req, res) => {
  res.render('create', { title: 'Create a new recipe' });
});
//GET ABOUT PAGE IN NAV
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// GET 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
