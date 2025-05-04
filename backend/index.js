require("dotenv").config();
const express = require("express");
const path = require("path")
const cors = require("cors");
const dbConnect = require("./config/db");
const linkRoutes = require("./routes/linksRoutes");
const { updateClicks } = require("./controller/linkController");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
dbConnect();

app.get("/", (req, res) => {
    res.json("Welcome to shortlink api..");
})

app.use("/api/shortlink", linkRoutes);
app.get("/:shortUrl", updateClicks);

app.listen(process.env.PORT, () => {
    console.log("Running on port: ", process.env.PORT);
})