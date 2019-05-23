//require all things that are needed for server and scraping information
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const exhbr = require("express-handlebars");

//require all of the models
const db = require("./models");
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


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//connect to the Mongo Db
mongoose.connect(MONGODB_URI);

app.get("/", function(req, res){
    res.send("yess this is acutally working lol")
})

//======================================Routes=================================
app.get("/scrape", function(req,res){

    //first we must collect the body of the html by using axios
    axios.get("https://www.developer-tech.com/").then(response => {
    
    //load the data into cherrio and save it     
    const $ = cheerio.load(response.data);

        //we select all Article tags with h3 tags
        $("article h3").each(function(i, element){
            //save the result to an empty object
            const result = {};

            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            console.log(result);

        })
    })

})


app.listen(PORT, function(){
    console.log("App Running On Port " + PORT + "!")
})