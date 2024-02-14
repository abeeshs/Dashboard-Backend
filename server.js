const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
const userRouter = require("./routers/authRoute");
dotenv.config();
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
mongoose
   .connect(process.env.MONGO_URL)
   .then((con) => console.log("Database Connected"));

app.use(
   cors({
      // origin: "http://localhost:3000",
      origin:"https://dashboard-frontend-m98k.onrender.com",
      origin:"https://dashboard-zeta-six-88.vercel.app",
      origin:"https://dashboard-23gumg2lm-abeeshs-projects.vercel.app"
      
   })
);
app.use("/", userRouter);

app.listen(port, () => console.log("Server running on port " + port));
