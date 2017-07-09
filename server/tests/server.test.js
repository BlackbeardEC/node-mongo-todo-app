const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


const todos = [{
    _id: new ObjectID(),
    text: '1st test todo'
  },{
    _id: new ObjectID(),
    text: '2nd test todo'
  }];


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

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
