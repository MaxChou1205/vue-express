const path = require("path");
const mongoose = require("mongoose");
const db = require("./config/keys").MongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error(err));

const express = require("express");
const cors = require("cors");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");

const app = express();
app.use(
  cors({
    allowedHeaders: ["x-auth-token"]
  })
);
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", users);
app.use("/api/profiles", profile);

if (process.env.NODE_ENV === "production") {
  // app.use(express.static("public"));
  app.use(express.static("client/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "index.html"));
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
