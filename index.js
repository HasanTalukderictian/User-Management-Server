
const express = require('express')
const app = express()
const port = process.env.PORT || 4000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



// middleware 

app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtmwivk.mongodb.net/?retryWrites=true&w=majority`;

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
     
    const userCollection = client.db("User_Mana_DB").collection("user");
    
    // post data 
    app.post('/user', async(req, res) => {
         const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result);

    })

    // for specific item finding 
    app.get('/user/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.find(query);
      res.send(result);
    })

    //for updating 
    app.put('/user/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const options = { upsert: true };
      const updateUser = req.body;
      const user = {
        $set: {
          name:updateUser.name, email:updateUser.email,
          gender:updateUser.gender, status:updateUser.status
        }
      }
      const result = await userCollection.updateOne(filter,user, options);
      res.send(result);
    })


    // get data 

    app.get('/user', async(req, res) => {
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);

    })

    // delete item 
    app.delete('/user/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
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
  res.send('Server is Running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})