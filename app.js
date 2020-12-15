const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const morgan = require('morgan');
const Rec = require('./recipeModel');
// const { result } = require('lodash');
const app = express();
// app.use(express.static('views'));

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
// mongoose
//   .connect(
//     'mongodb+srv://dgmFinal:dgmFinal123@cluster0.iorhc.mongodb.net/final?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then((result) =>
//     app.listen(process.env.PORT || port, () =>
//       console.log(`"Static Recipe App Listening at ${port}`)
//     )
//   )
//   .catch((err) => console.log(err));

//Set Veiw Engine
app.set('view engine', 'ejs');

// middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   res.locals.path = req.path;
//   next();
// });
// GET ROOT PAGE
app.get('/', (req, res) => {
  Rec.find()
    .sort({ updatedAt: -1 })
    .then((recs) => {
      res.render('index', { title: 'Home', recipe: recs });
    })
    .catch((err) => {
      console.log(err);
    });
});
// Sort highest to lowest
app.get('/sort', (req, res) => {
  Rec.find()
    .sort({ rating: -1 })
    .then((recs) => {
      res.render('index', { title: 'Home', recipe: recs });
    })

    .catch((err) => {
      console.log(err);
    });
});
// Sort highest to lowest
app.get('/sortdown', (req, res) => {
  Rec.find()
    .sort({ rating: 1 })
    .then((recs) => {
      res.render('index', { title: 'Home', recipe: recs });
    })

    .catch((err) => {
      console.log(err);
    });
});
//category Sort
app.get('/sortcategory/:cat', (req, res) => {
  const category = req.params.cat;
  Rec.find()
    .then((recs) => {
      let filter = recs.filter(function (e) {
        return e.category === category;
      });
      return filter;
    })
    .then((filter) => {
      res.render('index', { title: 'Home', recipe: filter });
    })

    .catch((err) => {
      console.log(err);
    });
});

app.post('/recipes', (req, res) => {
  const list = req.body.ingredients.split(',');
  const shoplist = list.map((item) => {
    return { complete: false, item: item, quantity: 1 };
  });
  console.log(shoplist);

  console.log('req.body', req.body);
  console.log(req.body.ingredients, list);
  const recipe = new Rec({
    name: req.body.name,
    category: req.body.category.toUpperCase(),
    ingredients: list,
    directions: req.body.directions,
    shopping: shoplist,
    rating: '1',
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

//UPDATE A SINGLE RECIPE NAME
app.put('/recipes/:update/:id', (req, res) => {
  const id = req.params.id;
  const update = req.params.update;
  Rec.findByIdAndUpdate(id, { new: true }, (err, rec) => {
    rec.name = update;
    rec.save().then((result) => {
      res.json({ redirect: `/recipes/${id}` });
    });
  });
});
//UPDATE A SINGLE RECIPE Category
app.put('/category/:update/:id', (req, res) => {
  const id = req.params.id;
  const update = req.params.update;
  Rec.findByIdAndUpdate(id, { new: true }, (err, rec) => {
    console.log(rec);
    rec.category = update.toUpperCase();
    rec.save().then((result) => {
      res.json({ redirect: `/recipes/${id}` });
    });
  });
});
//UPDATE A SINGLE RECIPE Rating
app.put('/rate/:update/:id', (req, res) => {
  const id = req.params.id;
  const update = req.params.update;
  Rec.findByIdAndUpdate(id, { new: true }, (err, rec) => {
    rec.rating = update;
    rec.save().then((result) => {
      res.json({ redirect: `/recipes/${id}` });
    });
  });
});

//UPDATE A SINGLE RECIPE DESCRIPTION
app.put('/directions/:update/:id', (req, res) => {
  const id = req.params.id;
  const update = req.params.update;
  Rec.findByIdAndUpdate(id, { new: true }, (err, rec) => {
    console.log(rec.directions);
    rec.directions = update;
    rec.save().then((result) => {
      res.json({ redirect: `/recipes/${id}` });
    });
  });
});
// Toggle list complete
app.put('/checkbox/:ing/:id', (req, res) => {
  const id = req.params.id;
  const update = req.params.update;
  const ingredient = req.params.ing;
  Rec.findByIdAndUpdate(id, ingredient, { new: true }, (err, rec) => {
    rec.shopping.filter((item) => {
      if (item._id == ingredient) {
        item.complete = !item.complete;
      }
    });
    rec.save().then((result) => {
      res.json({ redirect: `/recipes/${id}` });
    });
  });
});
// UPDATE A SINGLE SHOPPING ITEM QUANTITY
app.put('/item/:update/:ing/:id', (req, res) => {
  const id = req.params.id;
  const update = req.params.update;
  const ingredient = req.params.ing;
  Rec.findByIdAndUpdate(id, ingredient, { new: true }, (err, rec) => {
    console.log(rec);
    rec.shopping.filter((item) => {
      if (item._id == ingredient) {
        item.quantity = update;
      }
    });

    rec.save().then((result) => {
      res.json({ redirect: `/recipes/${id}` });
    });
  });
});
//DELETE ONE SHOPPING ITEM
app.put('/shopitem/:ing/:id', (req, res) => {
  const id = req.params.id;
  const update = req.params.update;
  const ingredient = req.params.ing;
  console.log('rec: ', id, 'ing', ingredient);
  Rec.findByIdAndUpdate(id, ingredient, { new: true }, (err, rec) => {
    rec.shopping.pull({ _id: ingredient });
    rec.save().then((result) => {
      res.json({ redirect: `/recipes/${id}` });
    });
  });
});
// ADD A NEW ITEM TO A SHOPPING LIST
app.put('/shoplist/:update/:id', (req, res) => {
  const id = req.params.id;
  const update = req.params.update;
  const ingredient = req.params.ing;
  console.log(update, id);
  Rec.findByIdAndUpdate(id, ingredient, { new: true }, (err, rec) => {
    console.log(rec, id, update);
    newItem = { complete: 'true', item: update, quantity: 1 };
    rec.shopping.push(newItem);

    rec.save().then((result) => {
      res.json({ redirect: `/recipes/${id}` });
    });
  });
});
// ADD A NEW INGREDIENT
app.put('/ingredient/:update/:id', (req, res) => {
  const id = req.params.id;
  const update = req.params.update;
  const ingredient = req.params.ing;
  Rec.findByIdAndUpdate(id, ingredient, { new: true }, (err, rec) => {
    console.log(rec, id, update);
    newItem = { complete: 'false', item: update, quantity: 1 };
    rec.shopping.push(newItem);
    rec.ingredients.push(update);

    rec.save().then((result) => {
      res.json({ redirect: `/recipes/${id}` });
    });
  });
});
// UPDATE A SINGLE SHOPPING ITEM NAME
app.put('/name/:update/:ing/:id', (req, res) => {
  const id = req.params.id;
  const update = req.params.update;
  const ingredient = req.params.ing;
  Rec.findByIdAndUpdate(id, ingredient, { new: true }, (err, rec) => {
    rec.shopping.filter((item) => {
      if (item._id == ingredient) {
        item.item = update;
      }
    });

    rec.save().then((result) => {
      res.json({ redirect: `/recipes/${id}` });
    });
  });
});
// GET A SHOPPING LIST ITEM TO UPDATE A QUANTITY
app.get('/list/:id/:ing', (req, res) => {
  const id = req.params.id;
  const ing = req.params;
  Rec.findById(id)
    .then((result) => {
      const filtershop = result.shopping.filter((item) => {
        return item._id == ing.ing;
      });
      res.render('shopItem', {
        single: filtershop,
        recipe: result,
        title: 'Edit Item Details',
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
// GET A ingredient LIST ITEM page
app.get('/deleteingredient/:id/:ing', (req, res) => {
  // console.log(req.params);
  const id = req.params.id;
  const ing = req.params;
  Rec.findById(id)
    .then((result) => {
      const filtershop = result.ingredients.filter((item) => {
        // console.log(item);
        return item == ing.ing;
      });
      res.render('ingredientItem', {
        single: filtershop,
        recipe: result,
        title: 'Edit Item Details',
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
//DELETE ONE ingredient ITEM
app.put('/ingdelete/:ing/:id', (req, res) => {
  const id = req.params.id;
  // const update = req.params.update;
  const ingredient = req.params.ing;
  console.log('recdfsafdsfa: ', 'ing', ingredient);
  Rec.findByIdAndUpdate(id, ingredient, { new: true }, (err, rec) => {
    console.log(rec.ingredients);
    rec.ingredients.pull(ingredient);
    rec.save().then((result) => {
      res.json({ redirect: `/recipes/${id}` });
    });
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
