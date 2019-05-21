const express = require('express')
const cors = require('cors')
const bodyParser  = require('body-parser');
const app = express()
const MongoClient = require('mongodb').MongoClient;
const MongoUrl = process.env.mongoUrl ||'mongodb://127.0.0.1:27017';
const dbName = process.env.dbName || 'myproject';
const dbCollection = process.env.dbCollection || 'documents';
require('dotenv').config();

const port = process.env.port || 8000

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  MongoClient.connect(MongoUrl, function(err, client) {
        if (err !== null) {
            res.send('Could not connect to MongoDB');
        } else {
            res.send('Connected to MongoDB');
            client.close();
        }
    });
})

app.get('/all', (req, res) => {
  MongoClient.connect(MongoUrl, function(err, client) {
      const db = client.db(dbName);
      // Get the documents collection
      const collection = db.collection(dbCollection);
      // Find document
      collection.find({}).toArray(function(err, docs) {
        if(!err) {
          res.json(docs);
        } else {
          res.json({find: false, error: true});
        }
      });
      client.close();
    });
})

app.post('/', (req, res) => {
    MongoClient.connect(MongoUrl, function(err, client) {
        const db = client.db(dbName);
        // Get the documents collection
        const collection = db.collection(dbCollection);
        // Insert some documents
        if(req.body) {
          collection.insertOne(req.body, function(err, result) {
            if(!err) {
              res.json({added: true, error: false});
            } else {
              res.json({added: false, error: true});
            }
          });
        } else {
          res.json({error: true});
        }
        client.close();
    });
})

app.delete('/', (req, res) => {
    MongoClient.connect(MongoUrl, function(err, client) {
      const db = client.db(dbName);
      // Get the documents collection
      const collection = db.collection(dbCollection);
      if(req.body)  {
        collection.deleteOne(req.body, function(err, result) {
          if(!err) {
            res.json({deleted: true, error: false});
          } else {
            res.json({deleted: false, error: true});
          }
        });
      } else {
        res.json({error: true});
      }
      client.close();
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
