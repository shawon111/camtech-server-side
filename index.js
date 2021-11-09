const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require("mongodb");
app.use(cors());
app.use(express.json());
const port = 5000;

app.get('/', (req, res) => {
    res.send("camtech server")
})

app.listen(port, () => {
    console.log("listening to the port:", port)
})