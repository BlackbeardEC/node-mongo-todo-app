const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const todos = [{
    _id: new ObjectID(),
    text: '1st test todo',
    _creator: userOneID
  },{
    _id: new ObjectID(),
    text: '2nd test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoID
  }];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

///////////////////////////////////////////



const users = [{
  _id: userOneID,
  email: 'user1@user1.com',
  password: 'UserOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneID, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
},{
  _id: userTwoID,
  email: 'user2@user2.com',
  password: 'UserTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoID, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const populateUsers = (done) => {
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};


module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
