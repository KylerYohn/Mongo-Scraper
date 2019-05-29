var apiRouter = require("express").Router();

//require packages for web scraping
const axios = require("axios");
const cheerio = require("cheerio");
//require all of the models
const db = require("../models");



apiRouter.get("/", function (req, res) {
    db.Article.find({})
        .then(Article => {
            Article.reverse();
            res.render("index", { dbArticles: Article })
        })
})

apiRouter.get("/scrape", function (req, res) {
    console.log("route works")
    //first we must collect the body of the html by using axios
    axios.get("https://www.developer-tech.com/news/")
        .then(response => {


            //load the data into cherrio and save it     
            const $ = cheerio.load(response.data);

            //we select all Article tags with h3 tags
            const articles = $("section article").map(function (element, i) {
                //save the result to an empty object
                const result = {};

                //find the anchor tag and grab the child tag with an h2 element for the title
                result.title = $(this).find("a").children("h2").text();
                //find the child tag with the first class then access its children divs to get a summary of the article
                result.summary = $(this).children(".image_and_summary_wrapper").children(".summary").text();
                //add the full url and grab the anchor tags attribute of href to complete the link
                result.URL = "https://www.developer-tech.com" + $(this).find("a").attr("href");


                db.Article.findOneAndUpdate({title: result.title}, result, {upsert: true}, function(err, articles){
                    if (err) throw err;
                    console.log(articles)
                })
            })
            //take the information that is stored into results and send it into the articles db
            const articlesAdded = new Promise((resolve, reject) => {


                resolve('success')
            });



            articlesAdded.then(response => res.redirect('/'));
        })
        .catch(err => console.log(err))

})

apiRouter.post("/articles/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(dbComment => {
            //first we must push the new comment into the comment array that is in the article collection
            db.Article.updateMany({ _id: req.params.id }, { $push: { comment: dbComment._id } })
                .then(function (dbArticles) {
                    //next we must use the promise that mongoose returns to string a .then function on to then update weather an article has a comment or not
                    db.Article.updateMany({ _id: req.params.id }, { $set: { hasComment: true } }).then(function (article) {
                        console.log(article);
                    })
                })

        })
})

apiRouter.get("/comments", function (req, res) {
    db.Article.find({ hasComment: true })
        .populate("comment")
        .then(function (results) {
            res.render("comments", { dbArticles: results })
        })
})

apiRouter.get("/clear", function (req, res) {
    db.Article.remove({}).then(function () {
        res.redirect("/")
    })
})

apiRouter.delete("/deleteComment/:id", function (req, res) {
    db.Comment.deleteOne({ _id: req.params.id })
        .then(function () {
            db.Article.updateOne({ comment: req.params.id }, { $pull: { comment: req.params.id } })
                .then(function () {
                    db.Article.find({ hasComment: true })
                        .then(function (results) {
                            results.forEach(articles => {
                                let comment = articles.comment;
                                console.log(comment.length)
                                if (comment.length === 0) {
                                    console.log("it is less than zero")
                                    db.Article.updateOne({ _id: articles._id }, { hasComment: false })
                                        .then(results => res.send(results))
                                }
                                else {
                                    res.send(articles);
                                }
                            })

                        })
                })
        })

})


module.exports = apiRouter;