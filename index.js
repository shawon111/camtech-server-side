const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send("camtech server")
})

// connect with mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gv57l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("camtech_digital");
    const cameraCollection = database.collection("cameras");
    const reviewsCollection = database.collection("reviews");
    const orderCollection = database.collection("orders");

    //get api for showing products
    app.get('/products', async (req, res) => {
      const cursor = cameraCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    })

    //get api for showing reviews
    app.get('/reviews', async (req, res) => {
      const cursor = reviewsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    })

    //get api for finding a product
    app.get('/products/:id', async (req, res) => {
      const Id = req.params.id;
      const query = { _id: ObjectId(Id) };
      const result = await cameraCollection.findOne(query);
      res.json(result)
    })

    //post api for creating new order
    app.post('/orders/neworder', async (req, res)=>{
      const doc = req.body;
      const result = await orderCollection.insertOne(doc);
      res.json(result);
    })

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("listening to the port:", port)
})