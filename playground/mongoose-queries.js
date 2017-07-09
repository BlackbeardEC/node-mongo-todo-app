const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} =require('./../server/models/todo');
const {User} =require('./../server/models/user');

// var id = "596165d733655d6d1ab003ec";
//
// if(!ObjectID.isValid(id)){
//   console.log('ID not valid');
// }
//
// // Todo.find({_id: id}).then((todos) => {
// //   console.log('Todos', todos);
// // });
// //
// //
// // Todo.findOne({_id: id}).then((todo) => {
// //   console.log('Todo', todo);
// // });
//
//
// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('ID not found');
//   }
//   console.log('Todo by id', todo);
// }).catch((e) => console.log(e));

////////////////////////////////////////
// user challenge

var id = "596112fa52614b5769c095f2";

User.findById(id).then((user) => {
  if(!user){
    return console.log('User not found');
  }
  console.log('User:', user);
}).catch((e) => console.log(e));
