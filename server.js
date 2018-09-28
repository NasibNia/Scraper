var express = require("express");
var bodyParser = require("body-parser");
var logger = require ("morgan");
var mongoose = require ("mongoose");


var PORT =  3000;

// Initialize Express
var app = express();


// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));


// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/hackerNewsdb";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/hackerNewsdb", { useNewUrlParser: true });
// Use body-parser for handling form submissions
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
//route
require("./routes/route.js")(app);


// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//start the server listener
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});