const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
const app = express();
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.use("/api", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/messages", messageRoute);

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})

mongoose.connect(uri).then(()=>{
    console.log("Connection established")
}).catch(err=>{
    console.log(err);
})