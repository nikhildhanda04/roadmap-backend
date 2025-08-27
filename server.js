const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler")
const connectDb = require("./config/dbconnection")
const app = express();
const cors = require("cors");

const port = process.env.PORT || 5000;

connectDb();
app.use(express.json());
app.use(cors({
  origin: [
    'https://roadmapgenerator.vercel.app',
    'http://localhost:3000', 
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use("/api/user", require('./routes/userRoute'))
app.use("/api/roadmap", require('./routes/roadmapRoute'))
app.use(errorHandler)


app.listen(port, '0.0.0.0',() => {
    console.log(`Server running on port ${port}`);
    
})