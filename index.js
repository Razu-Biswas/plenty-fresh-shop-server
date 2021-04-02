const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
var ObjectId = require('mongodb').ObjectID;

const port = process.env.PORT || 3300


app.use(cors());
app.use(bodyParser.json());



app.get('/', (req, res) => {
  res.send('Hello World! project working')
})





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g1ovq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
  const productCollection = client.db("plentyFresh").collection("product");
  const orderCollection = client.db('plentyFresh').collection('order');
  console.log('Database connected success')
  // perform actions on the collection object

  app.get('/product', (req, res) => {
		productCollection.find().toArray((err, items) => {
			res.send(items);
		});
	});

	// Get Single Book By Id
	app.get('/checkout/:id', (req, res) => {
		const id = new ObjectId(req.params.id);
		productCollection.find({ _id: id }).toArray((err, items) => {
			res.send(items);
		});
	});

	app.post('/addProduct', (req, res) => {
		const newProduct = req.body;
		console.log(newProduct);
		productCollection.insertOne(newProduct).then((result) => {
			console.log('inserted count', result.insertedCount);
			res.send(result.insertedCount > 0);
		});
	});

	app.delete('/deleteproduct/:id', (req, res) => {
		const id = ObjectID(req.params.id);
		console.log('delete this', id);
		productCollection
			.findOneAndDelete({ _id: id })
			.then((documents) => res.send(documents.value));
	});

	// save Order
	app.post('/saveorder', (req, res) => {
		const newOrder = req.body;
		console.log(newOrder);
		orderCollection.insertOne(newOrder)
    .then((result) => {
			console.log('insertedCount', result.insertedCount);
			if (result.insertedCount > 0) {
				res.status(200).json(result);
			}
		});
	});

	// Get All order
	app.get('/getorder', (req, res) => {
		orderCollection.find().toArray((err, items) => {
			res.send(items);
		});
	});
	// Get Single user  Order
	app.post('/userorder', (req, res) => {
		const userEmail = req.body.email;
		orderCollection.find({ email: userEmail }).toArray((err, items) => {
			res.send(items);
		});
	});

	// Order Delete
	app.delete('/deleteorder/:id', (req, res) => {
		const id = ObjectID(req.params.id);
		console.log('delete this', id);
		orderCollection
			.findOneAndDelete({ _id: id })
			.then((documents) => res.send(documents.value));
	});


 
});




app.listen(process.env.PORT || port)




