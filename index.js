const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cf70q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        await client.connect();
        const database = client.db("bikeNation");
        const servicesCollection = database.collection("services");
        const reviewsCollection = database.collection("reviews");
        const orderCollection = database.collection("orders")
        

        // post api 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log("hit the api", service);
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result)

        })


        // Get Api 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // Get single Service api 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })


        // post api reviews
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log("hit the api", review);
            const result = await reviewsCollection.insertOne(review);
            console.log(result)
            res.json(result)

        })


        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews)
        })


        //  orders post api

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            console.log(result)
            res.json(result);
        })


        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            console.log(query)
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello Bike Nation')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


// BikeNation 7NLvgvp98wGHzycW