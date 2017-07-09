const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} =require('./../server/models/todo');
const {User} =require('./../server/models/user');

// Todo.remove({}).then((res)=>{
//   console.log(res);
// })

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()

Todo.findByIdAndRemove("596286c0cd213a5bb0104d25").then((todo) => {
  console.log(todo);
});
