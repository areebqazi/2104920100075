const express = require("express");
const app = express();
const categories = require("./routes/categories");
const cors = require("cors");


app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/categories", categories);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
