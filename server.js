const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Todo = require('./todoModel');
const Cat = require('./categoryModel');
const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require('dotenv').config();

mongoose
  .connect(
    `${process.env.MONGOURL}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) =>
    app.listen(process.env.PORT || port, () =>
      console.log(`"Static Todo App Listening at ${port}`)
    )
  )
  .catch((err) => console.log(err));

app.post('/addtodo', (req, res) => {
  console.log(req.body);
  Todo.create(
    {
      todo: req.body.todo,
      complete: false,
      cat: req.body.cat,
    },

    (err, todos) => {
      if (err) {
        console.log(err);
      }
      Todo.find((err, todos) => {
        if (err) {
          console.log(err);
        }
        res.json(todos);
      });
    }
  );
});

app.get('/alltodos', (req, res) => {
  Todo.find((err, todo) => {
    if (err) {
      console.log(err);
    }
    res.json(todo);
  });
});
app.delete('/todo/:id', (req, res) => {
  Todo.deleteOne(
    {
      _id: req.params.id,
    },
    (err, todo) => {
      if (err) {
        console.log(err);
      }

      res.json(todo);
    }
  );
});
app.delete('/delete', (req, res) => {
  const query = { complete: true };

  Todo.deleteMany(query)
    .then((res) => res.json(todo))
    .catch((err) => console.error(`Delete failed with error: ${err}`));
});
app.put('/todo/:id', (req, res) => {
  Todo.findByIdAndUpdate(req.params.id, { new: true }, (err, todo) => {
    todo.complete = !todo.complete;
    todo.save();
    console.log(todo);

    Todo.updateOne(req.query, (err, todo) => {
      console.log(todo);

      console.log(req.params);
      if (err) {
        console.log(err);
      }
      Todo.find((err, todo) => {
        if (err) {
          console.log(err);
        }
        res.json(todo);
      });
    });
  });
});
