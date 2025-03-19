const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
var jwt = require('jsonwebtoken');
const cors = require('cors');
 

require('dotenv').config()
const port = process.env.PORT || 5000
// midwere

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6plf0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const menuCollection = client.db("resturent").collection("menu");
        const reviewsCollevtion = client.db('resturent').collection('reviews')
        const cartsCollevtion = client.db('resturent').collection(' carts')
        const usersCollection = client.db("resturent").collection("users");




        //   menuCollection
        app.get('/menus', async (req, res) => {
            const result = await menuCollection.find().toArray()
            res.send(result)
        })

        // reviewsCollevtion
        app.get('/reviewss', async (req, res) => {
            const result = await reviewsCollevtion.find().toArray()
            res.send(result)
        })

        // post cartsCollevtion
        app.post('/carts', async (req, res) => {
            const cartitem = req.body
            const resuilt = await cartsCollevtion.insertOne(cartitem)
            res.send(resuilt)
        })

        // get cartCollevtion
        app.get('/carts', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await cartsCollevtion.find(query).toArray()
            res.send(result)
        })

        // delete from client side (my cart)
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartsCollevtion.deleteOne(query)
            res.send(result)
        })

        // user post data from updateuser collervtion
        app.post('/users', async (req, res) => {
            const data = req.body
            // user email if use is not exit
            // you can do this many way (1.email unique, 2. upsert , 3.simple chacking)
            const query = { email: data.email }
            const exixtinguser = await usersCollection.findOne(query)
            if (exixtinguser) {
                return res.send({ massage: 'user already exit', insertedId: null })

            }

            const result = await usersCollection.insertOne(data)
            res.send(result)
        })

        // get data from updateuser collervtion
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })
        // delete usersCollections data 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
          
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })

        // make /update a admin 
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id
            // console.log(id);
            const filter = {_id: new ObjectId(id) }
            const updated = {
             $set:{   role: 'admin'}
            }
          const   result = await usersCollection.updateOne(filter,updated)
          res.send(result)
        })

// jwt related api
app.post('/jwt',async(req,res)=>{
 const    user=  req.body
  const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET ,{
        expiresIn:'1h'
    })
    res.send({token})
})



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('resturent is starting')
})
app.listen(port, () => {
    console.log(`resturent is sitting on ${port}`);

})










/***
 * -------------------------------
 * Naming Convention
 * ---------------------------------
 * app.get('/user')
 * app.get('/user/:id')
 * app.post('/user')
 * app. put('/ user/:id')
 * app.patch('/user/:id')
 * app.delete('/user/:id')
 * 
 * 
 * 
 * 
 */