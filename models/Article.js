var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title : {
        type : String,
        unique : true,
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
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;