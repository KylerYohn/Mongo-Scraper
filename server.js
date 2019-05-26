//require all things that are needed for server and scraping information
const express = require("express");
const mongoose = require("mongoose");
const exhbr = require("express-handlebars");


//initilize express
const app = express();

const PORT = process.env.PORT || 3000;

//parse requrest body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//allow the server to use the handlebars view engine
app.engine("handlebars", exhbr({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

//make the public folder a static folder
app.use(express.static("public"));

//require the routes folder to be used as middleware
var apiRoutes = require("./routes/routes");
app.use(apiRoutes);


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//connect to the Mongo Db
mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
    .then(res => {
        console.log("you are connected to the DB")
        //once the database is connected run the node server
        app.listen(PORT, function(){
            console.log("App Running On Port " + PORT + "!")
        })
    })
    .catch(err => console.log("there is an " + err));






