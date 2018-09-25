var express = require("express");
var bodyParser = require("body-parser");
var logger = require ("morgan");
var mongoose = require ("mongoose");

var PORT =  3000;

var  db = require("./models");
var app = express();
require("./route.js")(app);

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/populatedb", { useNewUrlParser: true });


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});