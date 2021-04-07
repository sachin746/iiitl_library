var mongoose = require("mongoose");

var IssuedSchema = new mongoose.Schema({
    rollno: String,
    book: String,
    bookno: String,
    created: { type: Date, default: Date.now },
    return: { type: Date, default: Date.now() + 15 * 24 * 3600 * 1000 }
})
module.exports = mongoose.model("Issued", IssuedSchema);