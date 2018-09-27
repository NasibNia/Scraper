var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    link : {
        type: String,
        required : true
    },
    points : {
        type:String,
        required:true
    },
    username : {
        type : String,
        required : true
    }, 
    userlink : {
        type : String,
        required : true
    },
    favorite:{
        type: Boolean,
        default : false
    },
    comment:{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;