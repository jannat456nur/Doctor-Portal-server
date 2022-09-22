const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.69qz5.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
     try{
        await client.connect();
        const database = client.db('doctors_portal')
        const appointmentsCollection=database.collection('appointments')
        const userCollection = database.collection('users')

        app.get('/appointments',async(req,res)=>{
          const email = req.query.email;
          const date = new Date( req.query.date).toLocaleString();
          const query = {email:email}
          console.log(query)
          const cursor = appointmentsCollection.find({})
          const appointments = await cursor.toArray();
          res.json(appointments);
        })


         app.post('/appointsments',async(req,res)=>{
            const appointment =req.body;
            // console.log(appointment);
            const result = await appointmentsCollection.insertOne(appointment)
            res.json({message:'hello'})
            console.log(result)
            res.json(result)

         })


          app.post('/users',async(req,res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.json(result)
          })
          app.put('/users',async(req,res) =>{
            const user = req.body;
            const filter = {email:user.email}
            const options = { upsert: true };
            const updateDoc = {$set:user}
            const result = await userCollection.updateOne(filter,updateDoc,options)
            res.json(result);
          })
          app.put('users/admin',async(req,res) =>{
            const user = req.body;
            const filter = {email:user.email};
            const updateDoc = {$set:{role:'admin'}};
            const result = await userCollection.updateOne(filter,updateDoc)
            res.json(result)
          })

        // app.get('/users')
        // app.get('users/:id')
        // app.post('/users')
        // app.put('/users/:id')
        // app.delete('/users/:id')
        console.log("database connected succesfully")
     }
     finally{
        //  await client.close();
     }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World! Doctor Portal");
});

app.listen(port, () => {
  console.log(`Example app listening on port`);
});
