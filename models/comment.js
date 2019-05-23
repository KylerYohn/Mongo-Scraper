const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    UserName:  String,
    comment: String
})
//create the comment model from the above schema
const Comment = mongoose.model("Comment", CommentSchema);

//export the comment model

module.exports = Comment;