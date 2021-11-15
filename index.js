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
    const userCollection = database.collection("registeredUsers");

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

    //get api for finding my orders
    app.get('/myorders', async (req, res)=> {
      const userEmail = req.query.email;
      const query = {ownerEmail: userEmail};
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    })
    
    //get api for finding all orders 
    app.get('/orders', async (req, res)=>{
      const cursor = orderCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    })

    //get api for finding user
    app.get('/users/:email', async (req, res)=>{
      const Email = req.params.email;
      const query = {userEmail: Email};
      const result = await userCollection.findOne(query);
      res.json(result);
      
    })

    //post api for creating new order
    app.post('/orders/neworder', async (req, res)=>{
      const doc = req.body;
      const result = await orderCollection.insertOne(doc);
      res.json(result);
    })

    //post api for adding new product
    app.post('/addproduct', async (req, res) => {
      const doc = req.body;
      const result = await cameraCollection.insertOne(doc);
      res.json(result);
    })

    //post api for adding review
    app.post('/addreview', async (req, res) => {
      const doc = req.body;
      const result = await reviewsCollection.insertOne(doc);
      res.json(result);
    })

    //post api for creating user in database
    app.post('/createuser', async (req, res)=> {
      const doc = req.body;
      const result = await userCollection.insertOne(doc);
      res.json(result);
    })
    
    //delete api for deleting an order
    app.delete('/deleteorder/:id', async (req, res)=>{
      const Id = req.params.id;
      const query = { _id: ObjectId(Id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);

    })

    //update api for updating order status
    app.put('/orders/:id', async (req, res)=>{
      const Id = req.params.id;
      const filter = { _id: ObjectId(Id) };
      const options = { upsert: true };
      const updatedDoc = req.body;
      const updateDoc = {
        $set: {
          status: updatedDoc.status
        }
      };
      const result = await orderCollection.updateOne(filter, updateDoc, options);
      res.json(result)
    })

    //update api for updating order status
    app.put('/makeadmin/:email', async (req, res)=> {
      const Email = req.params.email;
      const filter = {userEmail: Email}
      const options = { upsert: true };
      const updatedDoc = req.body;
      const updateDoc = {
        $set: {
          isAdmin: updatedDoc.isAdmin
        }
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
      console.log(updatedDoc.isAdmin);
    })

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("listening to the port:", port)
})