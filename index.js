const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clvrh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productsCollection = client.db("superShop").collection("products");
  const checkOutCollection = client.db("superShop").collection("checkOut");

  app.get('/products', (req, res) => {
    productsCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })





  app.delete('/delete/:id', (req, res)=>{
    const id = ObjectId(req.params.id)
    console.log("delete this",id)
    productsCollection.deleteOne({_id: id})
    .then(result => {
      console.log(result)
      res.send(result)
    })

  })




  app.get('/checkOut', (req, res) => {
    console.log(req.query.email)
    checkOutCollection.find({email: req.query.email})
      .toArray((err, items) => {
        res.send(items)
      })
  })



  app.get('/product/:id', (req, res) => {
    productsCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  app.post('/addCheckOut', (req, res) => {
    const newCheckout = req.body;
    checkOutCollection.insertOne(newCheckout)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })


  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    productsCollection.insertOne(newProduct)
      .then(result => {
        res.redirect('/')
      })
  })

});



app.listen(port)

