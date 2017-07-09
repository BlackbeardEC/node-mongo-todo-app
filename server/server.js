const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt
  });

  todo.save().then((doc) => {
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.status(200).send({todos});
  }, (e) => {
    res.send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findById(req.params.id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send({todo});

  }, (e) => {
    res.status(400).send();
  });
});



app.listen(port, ()=>{
  console.log(`Server started on http://localhost:${port}`);
});


module.exports = {
  app
};
