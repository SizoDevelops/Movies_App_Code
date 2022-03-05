const express = require("express");
const app = express();
const moviesRouter = require('./routes/movies')
app.use(express.static(__dirname));
app.set("view engine", "ejs");
app.use("/", moviesRouter)
app.listen(process.env.PORT || 5000 , () => {
    console.log("Listening to port")
}) 
