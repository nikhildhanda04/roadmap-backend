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
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use("/api/user", require('./routes/userRoute'))
app.use("/api/roadmap", require('./routes/roadmapRoute'))
app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    
})