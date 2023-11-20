const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");


connectDb();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json()); //body-parser(inbuilt-middleware)
app.use("/api/contacts", require("./routes/contactRoutes")); //Express middleware
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});
