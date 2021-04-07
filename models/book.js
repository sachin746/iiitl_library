var mongoose = require("mongoose");
var bookSchema = new mongoose.Schema({
    title: String,
    image: String,
    total:Number,
    bookno:String
})

module.exports= mongoose.model("book", bookSchema);