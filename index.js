const express = require('express')
const cors = require('cors')
const bodyParser  = require('body-parser');
const util = require('util');
const app = express()
const MongoClient = require('mongodb').MongoClient;
const kafka = require('kafka-node');
require('dotenv').config();
// mongodb://127.0.0.1:27017 for local or mongodb://mongo:27017 for docker
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017';
const dbName = process.env.DB_NAME || 'myproject';
const dbCollection = process.env.DB_COLLECTION || 'documents';
const port = process.env.PORT || 1603;
// localhost:9092 for local or kafka:9092 for docker
const kafkaHost = process.env.KAFKA_HOST || 'kafka:9092';
const mainTopic = [{
  topic: dbName
}];
const kafkaOptions = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  encoding: "buffer"
};
const kafkaClient = new kafka.KafkaClient({kafkaHost: kafkaHost});
const kafkaProducer = new kafka.HighLevelProducer(kafkaClient);
const kafkaConsumer = new kafka.Consumer(kafkaClient, mainTopic, kafkaOptions);
/*
const promClient = require('prom-client');
const promHost = process.env.PROM_HOST || 'prom:9090';
// localhost:9092 for local or prom:9090 for docker
const promGateway = new promClient.Pushgateway(promHost);
*/

kafkaProducer.on("ready", function() {
    kafkaClient.createTopics(mainTopic, (error, result) => {
      if(!error) {
        console.log(result)
      } else {
        console.log(error)
      }
    });
    console.log("Kafka Producer is connected and ready.");
});

kafkaProducer.on("error", function(error) {
    console.error(error);
});

kafkaConsumer.on("message", function(message) {
    console.log('kafka consumer :')
    console.log('<=====================>')
    var buf = new Buffer(message.value, "binary");
    var decodedMessage = JSON.parse(buf.toString());
    console.log(util.inspect(decodedMessage, false, null, true));
    console.log('<=====================>')
    /*promGateway.push(decodedMessage, function(err, resp, body) {
      console.log('in prometheus :')
      console.log(err)
      console.log(resp)
      console.log(body)
    });
    */
});

kafkaConsumer.on("error", function(err) {
    console.log("error", err);
});

kafkaConsumer.on("SIGINT", function() {
    kafkaConsumer.close(true, function() {
        console.log('kafka is close');
    });
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  MongoClient.connect(mongoUrl, function(err, client) {
        if (err !== null) {
            res.json({message: 'could not connect to mongodb', error: true});
        } else {
            res.json({message: 'connected to mongodb', error: false})
            client.close();
        }
    });
})

app.get('/all', (req, res) => {
  MongoClient.connect(mongoUrl, function(err, client) {
      const db = client.db(dbName);
      // Get the documents collection
      const collection = db.collection(dbCollection);
      // Find document
      collection.find({}).toArray(function(err, docs) {
        if(!err) {
          const buffer = new Buffer.from(JSON.stringify(docs));
          const record = [
              {
                  topic: dbName,
                  messages: buffer,
                  attributes: 1 /* Use GZip compression for the payload */
              }
          ];
          kafkaProducer.send(record, function (error, data) {
              if(!error) {
                console.log(data);
                res.json(docs);
              } else {
                res.json({message: 'error with kafka', error: true});
              }
          });
        } else {
          res.json({message: 'error with mongo', error: true});
        }
      });
      client.close();
    });
})

app.post('/', (req, res) => {
    MongoClient.connect(mongoUrl, function(err, client) {
        const db = client.db(dbName);
        // Get the documents collection
        const collection = db.collection(dbCollection);
        // Insert some documents
        if(req.body) {
          collection.insertOne(req.body, function(err, result) {
            if(!err) {
              const buffer = new Buffer.from(JSON.stringify([{data: req.body}]));
              const record = [
                  {
                      topic: dbName,
                      messages: buffer,
                      attributes: 1 /* Use GZip compression for the payload */
                  }
              ];
              kafkaProducer.send(record, function (error, data) {
                  if(!error) {
                    console.log(data);
                    res.json({message: 'added to the database and kafka', error: false});
                  } else {
                    res.json({message: 'error with kafka', error: true});
                  }
              });
            } else {
              res.json({message: 'error with mongo', error: true});
            }
          });
        } else {
          res.json({message: 'error with the body of the request', error: true});
        }
        client.close();
    });
})

app.delete('/', (req, res) => {
    MongoClient.connect(mongoUrl, function(err, client) {
      const db = client.db(dbName);
      // Get the documents collection
      const collection = db.collection(dbCollection);
      if(req.body)  {
        collection.deleteOne(req.body, function(err, result) {
          if(!err) {
            const buffer = new Buffer.from(JSON.stringify([{data: req.body}]));
            const record = [
                {
                    topic: dbName,
                    messages: buffer,
                    attributes: 1 /* Use GZip compression for the payload */
                }
            ];
            kafkaProducer.send(record, function (error, data) {
                if(!error) {
                  console.log(data);
                  res.json({message: 'remove to the database and message added to kafka', error: false});
                } else {
                  res.json({message: 'error with kafka', error: true});
                }
            });
          } else {
            res.json({message: 'error with mongo', error: true});
          }
        });
      } else {
        res.json({message: 'error with the body of the request', error: true});
      }
      client.close();
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
