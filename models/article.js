var mongoose = require("mongoose");

//save a reference to the schema constructor
var Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    //title is required
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    URL: {
        type: String,
        required: true,
    },

    //comment is an object that stores a comment Id
    //it will be linked to the object Id in the comment model
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }

})

const Article = mongoose.model("Article", ArticleSchema)

//create our model from the schema

module.export = Article;