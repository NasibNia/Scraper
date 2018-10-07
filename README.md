# YC Scraper! All about Hackernews!

This fun project is about scraping my favorite website that is nothing but "YC's Hackernews". And what is more delightful than that? To have my own library of news all in one place with the additional option to make notes of my own and customizing them in my own way!
And it is not only for me; any body can use it and enjoy!

![scraping]("https://media.giphy.com/media/Ah3zHH7hvsSB2/giphy.gif")

# More about the application
The application is deployed on heroku and can be launched through by clicking on this link ["YC HackerNews Scraper"](https://hackernewsscraper.herokuapp.com/).
I used mongoDB to store my precious collection of scraped articles along with couple of properties that were kind of interesting to me personally, including title of the article and the link to its complete read, the points of the article based on readers opinion and the author username and the link to his/her profile. I also created a boolean property in the schema to keep track of the articles that I have marked as favorite. Also, I made another collection with the name note that is owned by the atricle as well. This has been made possible by refrecing the ObjectId of the article in the note. The note will be populated and added to a specific article every time that the user makes a note about that article. This way, each article could have itsown notes, and the note could be read, updated or deleted after they are made as well.

By clicking on the Scrape button all the articles in the [HackerNews website](https://news.ycombinator.com/) will be scraped and shown in the page. If the page has already contains some articles, meaning that some scraping has been already done, the articles currently existing in our database would not be duplicated. The new ones, however, will be added to our database and ,hence loaded on the page.

#Modularity of the application

The structure of the application is made in a modular way. The main structure contains the following:

- models 
    - Containing the schemas of our mongoDB database collections. 
- public:
    - Containing the client side features: images, css files , and client side javascript files.
- routes :
    - This is the heart of the server routes functionalities ; Contatining the get routes to "main page", "scraping channel", "all articles", "specific articles defined by their ids", and post route to "specific article by its id". This latter route will be used to create or update the note on a specific article.
- views :
    - Containing handlebars. The wonderfully fun templates to render results directly from the server to the front end. Handlebars are so fun to work with, and so far are my best favorites after react!
- And the last but not the list :  The server! 

#What happens on the backend?

Starting from the server, where the dependencies are initialize for the appication and the server starts to listen through the defined port. The app will be directed to the routes where the homepage will be rendered by list of all articles existing in our databade.

Everytime that the user presses scraping button, from the client side javascript a get request will be sent to the rough "/scrape" where in 
a request will be made to the [HackerNews website](https://news.ycombinator.com/) and the html of the website will be grabbed. I used the "span" elements with the class name of "sitebit" to get the information about the article. For each article, the information are stored in an abject and used to add to the database using the mongoDB built-in function "create".

Also, whenever the user wants to add or update a note to a specific article, the id of that article will be used to find the article. the note will then be posted to that article. If the article already has a note the note will be updated in case user wants to do so. this functionality is made by using the mongoDB built-in functions "create" and "findOneAndUpdate". The results are the back as json objects. 
The page will be reloaded to the main page which means rerendering all the articles to the main page including the newly added ones. The redirection to the main page happends due to a command made in the client side javascript.

The handlebars will populate the page using the structure provided for html components as well the variable information provided by the server in the object format by the key of "allArticles" and the value of array of all the articles existing in the databas.

# some code snippets
This block of code shows the schema for the articles. As it can be seen each article could reference to a property by the note which is defined in a differnet collection named "Note".
```
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
```
This block of code show the get route to the "scrape". As mentioned before a request is made to the website and the html of the website is grabbed in response. the scraping is then happens by getting the elemets of interest from that html. Here"span" elements with the class of 'sitebit" are selected and some children of the element are used to extract the data.
```
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
```

This block of the code show how we could add or update a note on a specific article:
```
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
```
This block of code belongs to the handlebar and shows how the properties that are loading on the page are populated. points, userlink and username, note, and note.body are all populated from the array of objects that are sent from the get route to the main page in the server side.
other properties could also be decided based on the information: for example if the article is saved as a favorite the heart symbole on the bar would have a red colore while the color would be white otherwise. similarly for the comment, the color would be red if there is already a note made for that article.
```
<div class="col-md-10">
    <div><p>{{this.points}}</p>
    <a class="hvr-bounce-in" href="{{this.userlink}}"><p>{{this.username}}</p></a></div> 
</div>
<div class="col-md-2">
    <div>
        {{#if note}}
        <a ><i class="fa fa-comment cmnt-btn" style="color:red" data-toggle="modal" data-target="#boxModal"  data-noteid="{{note._id}}"  data-body="{{note.body}}" data-id="{{_id}}" ></i></a>
        {{else}}
        <a ><i class="fa fa-comment cmnt-btn" style="color:white" data-toggle="modal" data-target="#boxModal"  data-noteid="{{note._id}}"  data-body="{{note.body}}" data-id="{{this._id}}"></i></a>
        {{/if}}

        <a ><i class="fa fa-trash del-article"></i></a>
        {{#if this.favorite}}
            <a ><i class="fa fa-heart" id="fav-id" data-id="{{_id}}" style="color:red"></i></a>
        {{else}}
            <a ><i class="fa fa-heart" id="fav-id" data-id="{{_id}}" style="color:white"></i></a>
        {{/if}}
    </div>
</div>
```

# Learning points
<!-- Learning points where you would write what you thought was helpful -->
- javascript
- node.js
- server
- express.js
- routes
- PORT
- mongoDB, mongoose
- middlewares, body parser,
- scraping
- handlebars


# Author 
<!-- make a link to the deployed site and have your name as the link -->
Nasibeh Nourbakhshnia
[Portfolio](https://nasib-portfolio.herokuapp.com/)
[LinkedIn](www.linkedin.com/in/nasibehnourbakhshnia)