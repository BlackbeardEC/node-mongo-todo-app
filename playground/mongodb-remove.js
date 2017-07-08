// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if(err){
    return console.log('Unable to connect to Monogodb server.');
  }
  console.log('Connected to Monogodb server.');

  // deleteMany
  // db.collection('Todos').deleteMany({text: "Some stuff"}).then((res)=>{
  //   console.log(res);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'Some stuff'}).then((res)=>{
  //   console.log(res);
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((res)=>{
  //   console.log(res);
  // });

  // db.collection('Users').deleteMany({name: 'Rich'}).then((res)=>{
  //   console.log('Deleted users:', res);
  // });

  db.collection('Users').findOneAndDelete({_id: new ObjectID('59602f33572263223b5dc6e1')}).then((res)=>{
    console.log('User deleted: ', JSON.stringify(res, undefined, 2));
  });


  // db.close();
});
