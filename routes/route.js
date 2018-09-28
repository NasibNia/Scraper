// import the models
var  db = require("../models");
//scraping tools
// It works on the client and on the server
var request = require("request");
var cheerio = require("cheerio");
var path    = require('path');

module.exports = function(app){

    app.get("/",function(req,res){
        db.Article.find({})
        .populate("note")
        .then(function(dbArticle){
            console.log("about to send results to handlebars  ", dbArticle);
            res.render("index" , {allArticles : dbArticle});
        })
        .catch(function(err){
            res.json(err);
        });
    });

    // A get route to scrape the mashable website
    app.get("/scrape", function(req,res){
        //grab the body of html with request       
        request("https://news.ycombinator.com/" , function(error, response,html){
            
            //load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);
            
            // grab any h2 within the article tag and do the following:
            $("span.sitebit").each(function(i , element){
                // empty results object
                var results ={};
                var a = $(element).prev();
                var subtext = $(element).prev().parent().parent().next().children('.subtext').children();
                var points = $(subtext).eq(0).text();
                var username = $(subtext).eq(1).text();
                var userlink = $(subtext).eq(1).attr("href");

                console.log("a  ", a.text());
                // console.log("href  ", a.attr('href'));
                // console.log("points  ", points);
                // console.log("author  ", username);
                // console.log("author  ", userlink);

                results.title = a.text();
                results.link  = a.attr("href");
                results.points= points;
                results.username = username;
                results.userlink = "https://news.ycombinator.com/"+userlink;

                db.Article.create(results)
                .then(function(dbArticle) {
                    // View the added result in the console
                    res.json(dbArticle);
                })
                .catch(function(err) {
                  // If an error occurs, send the error to the client
                  res.json(err);
                });
            });
            //If scrape completes send a response to the page
            res.send("scrape completed");
        });
    });


    app.get("/articles" , function(req,res){
        db.Article.find({})
        .then(function(dbArticle)
        {  
            res.json(dbArticle);
        })
        .catch(function(err){

        });
    });

    app.get("/articles/:id",function(req,res){
        db.Article.findOne({_id : req.params.id})
        .populate("note")
        .then(function(dbArticle){
            console.log("article found ", dbArticle);
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
    });

    app.post("/articles/:id", function(req,res){
        console.log("djbhaszxn",req.body);
        db.Note.create(req.body)
        .then(function(dbNote){
            console.log("inside server post");
            return db.Article.findOneAndUpdate({ _id : req.params.id} , {note : dbNote._id} , {new: true});
        })
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
    });

};