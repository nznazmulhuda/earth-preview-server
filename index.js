const express = require("express")
const cors = require("cors")
require("dotenv").config()
const port = process.env.PORT || 5000
const app = express()

// middelware
app.use(express.json())
app.use(cors())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAE}:${process.env.DB_PASSWORD}@cluster0.pbmq8lu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const Spots = client.db("Spots").collection("mySpots");

        app.get("/addSpots", async (req,res)=> {
            const cursor = await Spots.find().toArray();
            res.send(cursor);
        })

        app.post("/addSpots", async (req,res)=> {
            const spots = req.body;
            const result = await Spots.insertOne(spots)
            res.send(result)
        })

        app.get("/myLists/:email", async (req, res) => {
            const email = req.params
            const result = await Spots.find(email).toArray()
            res.send(result)
        })

        app.get("/details/:id", async (req, res) => {
            const id = req.params;
            const result = await Spots.find({_id: new ObjectId(id)}).toArray()
            res.send(result["0"])
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

app.get("/", (req,res) => {
    res.send("first server running")
})

app.listen(port, ()=> console.log(`server is running on port: ${port}`))