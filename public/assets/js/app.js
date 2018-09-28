
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
    
    $(document).on('click','.cmnt-btn', function(event){
        console.log(this)
        var id  = $(this).attr('data-id');
    //Posting a comment to database
    $(document).on('click','#save-btn', function(e){
        // console.log(this)
        // var id  = $(this).attr('data-id');
        // var id = $('#comment-form').attr('data-id');
        // var id="5bad95f9bf26d894acdac54a";
        var body = $("#commentInput").val().trim();
        console.log("body is ", body);
        console.log("id which will be posted to is  :", id);

        var newData = {
            body: body
        };
        $.ajax({
            method : "POST",
            url : "/articles/" + id,
            data : newData
        }).then(function(result){
            console.log("comment posted with the id of ", id);
            location.reload();
        });
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

    // $(document).on('click', ".alert", function(event){
    //     var id = $(this).attr('data-id');
    //     $.get("/articles/" +id , function(results){
    //         console.log("load specific articles"  , results);
    
    //     });

    // });

});


