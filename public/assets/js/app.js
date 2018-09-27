
$(document).ready(function(){
    
    

    $.ajax({
        method :"GET",
        url : "/articles",
    }).then(function(results){
        console.log("load all the articles");
        //if results is not empty
        if(results.length > 0 ){
            displayArticles(results);
        } else {
            scrape();
        }
    });
    $('#Scrape-btn').on('click',function(event){
        console.log("inside scrape btn");
        scrape();
    });

    $('.cmnt-btn').on('click',function(event){

    });

    


});

function displayArticles(data){
    var newArticle = $('div');
    for (var i = 0; i < data.length; i++) {
        var html = 
        `<div class="alert alert-primary hvr-bounce-in" style="width: 100%" role="alert" data-id=${data[i]._id}>
            <div class="row">
                <div class="col-md-12">
                    <a href="${data[i].link}">${data[i].title}</a> 
                </div>
            </div>
        
            <div class="row">
                <div class="col-md-8">
                    <div><h4>${data[i].points}</h4></div>
                    <div><a href="${data[i].userlink}"><h4>${data[i].username}</h4></a></div> 
                </div>
                <div class="col-md-4">
                    <div>
                        <a href="#"><i class="fa fa-comment cmnt-btn" data-toggle="modal" data-target="#boxModal"></i></a>
                        <a href="#"><i class="fa fa-trash del-article"></i></a>
                        <a href="#"><i class="fa fa-heart" style="color:red"></i></a>
                    </div>
                </div>

                
                <!-- Modal -->
                <div class="modal fade cornered" id="boxModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ...
                    </div>
                    <div class="modal-footer">
                    <a href="#"><i class="fa fa-trash del-note"></i></a>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
                </div>


            </div>
        </div>`;

        newArticle.append(html);               
    }
    $('#scraped-div').append(newArticle);
}

function scrape(){
    $.ajax({
        method :"GET",
        url : "/scrape",
    }).then(function(result){
        console.log("scrape completed, redirecting to the main page");
        window.location.href = "/";
    });
}