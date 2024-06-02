const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
global.connectPool = require("./src/utils/connection");
const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

// Routes Paths
const MigrationRoutes = require("./src/routes/migrationRoutes");
const PostRoutes = require("./src/routes/formRoutes");

// Routes
app.use("/api", MigrationRoutes);
app.use("/api/form", PostRoutes);

app.use("/uploads", express.static(__dirname.replace("/src", "") + "/uploads"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(port, () => console.log(`Server running on port ${port}`));
