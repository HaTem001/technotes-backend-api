const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const FormDataModel = mongoose.model("FormData", formDataSchema);

app.post("/api/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const formData = new FormDataModel({ name, email, message });
    await formData.save();

    res.json({ success: true, message: "Data saved successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
