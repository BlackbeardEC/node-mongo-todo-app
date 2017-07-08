const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if(err){
    return console.log('Unable to connect to Monogodb server.');
  }
  console.log('Connected to Monogodb server.');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("596027e531e2965eb8b60c36")
  // },{
  //   $set: {
  //     completed: true
  //   }
  // },{
  //   returnOriginal: false
  // }).then((res)=>{
  //   console.log(res);
  // });

  db.collection('Users').findOneAndUpdate({_id: new ObjectID("595fbd24a2a1a20a547f84f3")},{
    $inc: {
      age: -1
    }
  },{returnOriginal: false}).then((res)=>{
    console.log(res);
  });


  // db.close();
});
