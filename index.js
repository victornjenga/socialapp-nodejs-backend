const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const router = express.Router();
const path = require("path");
const cors = require("cors");
dotenv.config();

const port = 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to db successfully"))
  .catch((err) => console.log(err));

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.get("/", (req, res) => {
  res.send("This is the Homepage");
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);

app.listen(process.env.Port || port, () => {
  console.log("Backend server is running!");
});
