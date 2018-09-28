
$(document).ready(function(){
    
    // getting all the articles
    $.get("/" , function(results){
        console.log("load all the articles" );

    });

    // scraping articles
    $('#Scrape-btn').on('click',function(event){
        console.log("inside scrape btn");
        scrape();
    });
    
    //updating a comment in the database
    $(document).on('submit','#comment-form', function(event){
        var id  = $(this).attr('data-id');
        var body = $("#commentInput").val().trim();
        console.log("id is  :", id);
        console.log("body is ", body);
        var newData = {
            body: body
        };
        $.ajax({
            method : "POST",
            url : "/articles/" + id,
            data : newData
        }).then(function(){
            console.log("comment posted");
            location.reload();
        });
    });
    function scrape(){
        $.ajax({
            method :"GET",
            url : "/scrape",
        }).then(function(result){
            console.log("scrape completed, redirecting to the main page");
            window.location.href = "/";
        });
    }

    $(document).on('click', ".alert", function(event){
        var id = $(this).attr('data-id');
        $.get("/articles/" +id , function(results){
            console.log("load specific articles"  , results);
    
        });

    });

});


