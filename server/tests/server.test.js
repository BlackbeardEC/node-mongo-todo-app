const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, populateUsers, users} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', ()=>{
  it('Should create a new todo', (done)=>{

    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err, res)=>{
        if(err){
          return done(err);
        }

        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });

  });

  it('Should NOT create a new todo with invalid data', (done)=>{

      request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res)=>{
          if(err){
            return done(err);
          }

          Todo.find().then((todos)=>{
            expect(todos.length).toBe(2);
            done();
          }).catch((e) => done(e));
        });

  });

});

describe('GET /todos', ()=>{

  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      })
      .end(done)
  });

});

describe('GET /todos/:id', ()=>{
  it('Should return todo doc', (done)=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done)

  });

  it('Should return 404 if todo not found', (done)=>{
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done)
  });

  it('Should return 404 for non-object ids', (done)=>{
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
  });


});

///////////////////////////
// DELETE challenge
describe('DELETE /todos/:id', ()=>{

  it('Should remove a todo', (done)=>{
    request(app)
      .delete(`/todos/${todos[0]._id}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
      })
      .end((err, res)=>{
        if(err){
          return done(err);
        }
        Todo.findById(todos[0]._id).then((todo)=>{
          expect(todo).toNotExist();
        }).catch((e) => done(e));
        done();
      })
  });

  it('Should return 404 if todo not found', (done)=>{
    request(app)
      .delete('/todos/59628891570b42309897d75d')
      .expect(404)
      .end(done)
  });

  it('Should return 404 if ID invalid', (done)=>{
    request(app)
      .delete('/todos/59628891570b42309897d75d11')
      .expect(404)
      .end(done)
  });


});

////////////////////////
// PATCH challenge
describe('PATCH /todos/:id', ()=>{

  it('Should update todo', (done) => {
    var newTodo = {
      text: 'new text',
      completed: true
    };
    request(app)
      .patch(`/todos/${todos[0]._id}`)
      .send(newTodo)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(newTodo.text);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done)
  });

  it('Should clear completedAt when todo is not completed', (done) => {
    var newTodo2 = {
      text: '2nd new text',
      completed: false
    };
    request(app)
      .patch(`/todos/${todos[1]._id}`)
      .send(newTodo2)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(newTodo2.text);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done)
  });


});

describe('GET /users/me', ()=>{
  it('should return user if authenticated', (done)=>{
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done)
  });

  it('should return 401 if not authenticated', (done)=>{
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({});
      })
      .end(done)
  });

});

describe('POST /users', ()=>{
  it('should create a user', (done)=>{
    var email = 'email@things.com';
    var password = 'abc123';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err)=>{
        if(err){
          return done(err);
        }
        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      })

  });

  it('should return validation errors if request invalid', (done)=>{
    var email = 'blah@blahcom';
    var password = '1';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });

  it('should not create user if email in use', (done)=>{
    var email = 'user1@user1.com';
    var password = '123abcc';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });

});

describe('POST /users/login', ()=>{
  it('should login user and return auth token', (done)=>{
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res)=>{
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      })
  });

  it('should reject invalid login', (done)=>{
    var email = 'user2@user2.com';
    var password = '123';
    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(400)
      .expect((res)=>{
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res)=>{
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      })
  });


});

describe('DELETE /users/me/token', ()=>{
  it('should delete token from db on logout', (done)=>{
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res)=>{
        if(err){
          return done(err);
        }
        User.findById(users[0]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      })
  });


});
