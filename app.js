const express = require("express");
const app = express();
const moviesRouter = require('./routes/movies')
app.use(express.static(__dirname));
app.set("view engine", "ejs");
<<<<<<< HEAD
app.use("/", moviesRouter)
app.listen(process.env.PORT || 5000 , () => {
    console.log("Listening to port")
}) 
=======
app.use('/movies', moviesRouter)
app.listen(process.env.PORT || 4000 , () => {
    console.log("Listening to port")
})
>>>>>>> b23b80c32318cd53c425c20331eec83e71124d86
