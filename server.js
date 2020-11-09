const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Rec = require('./todoModel');
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
      console.log(`"Static Todo App Listening at ${port}`)
    )
  )
  .catch((err) => console.log(err));

app.post('/addtodo', (req, res) => {
  // console.log(req.body);
  Rec.create(
    {
      recipe: req.body.todo,
      complete: false,
      cat: req.body.cat,
    },

    (err, recipes) => {
      if (err) {
        console.log(err);
      }
      Rec.find((err, recs) => {
        if (err) {
          console.log(err);
        }
        res.json(recs);
      });
    }
  );
});

app.get('/alltodos', (req, res) => {
  Rec.find((err, recs) => {
    if (err) {
      console.log(err);
    }
    res.json(recs);
  });
});
app.delete('/todo/:id', (req, res) => {
  Rec.deleteOne(
    {
      _id: req.params.id,
    },
    (err, recs) => {
      if (err) {
        console.log(err);
      }

      res.json(recs);
    }
  );
});
app.delete('/delete', (req, res) => {
  const query = { complete: true };

  Rec.deleteMany(query)
    .then((res) => res.json(todo))
    .catch((err) => console.error(`Delete failed with error: ${err}`));
});
app.put('/todo/:id', (req, res) => {
  Rec.findByIdAndUpdate(req.params.id, { new: true }, (err, recs) => {
    recs.complete = !recs.complete;
    recs.save();
    // console.log(recipe);

    Rec.updateOne(req.query, (err, recipe) => {
      // console.log(recipe);

      // console.log( req.params);
      if (err) {
        console.log(err);
      }
      Rec.find((err, rec) => {
        if (err) {
          console.log(err);
        }
        res.json(rec);
      });
    });
  });
});
