var counter = 0;
$(document).ready(function() {

    var id = getUrlParameter('id');
    showPublicPaintings(id); 
    $('#loadMore').click(function () {
        showPublicPaintings(id); 
    });
});

//This is used for displaying all the public images
function showPublicPaintings(id){

    $.ajax({
        url:  `${baseUrl}/api/media/public-albums/artist?id=${id}&pageNo=${counter}&pageLimit=4` ,
        type: "GET",
        crossDomain: true,
        data: {},
        async: false,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (response) {
            if(response.mediaList.length){
                
                setAllPaintings(response); 
                $('#loadMore').show(); 
            } else if(counter == 0){
                $('#warningMsg').text("Opps! Artist has not uploaded any Painting Yet!!");
            //    swal("There are No paintings!");
            } else{
                swal('There are no more paintings')
                $('#loadMore').hide();
            } 
            counter++;            
        },
        error: function( error) {
        }   ,
        complete: function () {     
            bindCall();
        }           
    });
     
}

// This is used to set all the imges to the page
function setAllPaintings(response){

    var paintingList = response.mediaList;

    for(var i=0; i<paintingList.length;i++){

        var col =   '<div class="col-md-3  col-padding " >'+
                        '<img class="work" alt="img not loaded"'+
                        'src="'+ baseUrl + paintingList[i].pathThumb + paintingList[i].fileName +'" ></img>'+
                    '</div>';

        $('#publicImgDiv').append(col);          
    }    
}

//This is used to preview the images when user hover the image
function publicImagePreview(source){
    var source1 = source;
    var index = source.indexOf('thumbnail/thumb');
    source = source.substring(0,index)+source1.substring(index+15);
    var div= document.createElement("div");
    div.className += 'over';
    div.id += 'over';
    document.body.appendChild(div);
    var div = '<div class="container" id="prev"><img style="max-height:500px;" id="prev-img" src="'+source+'"/>'+
        '<span style=color: white;><button id="closePrev" class="btn btn-primary" onClick="closePreview();">Close</button></span></div>';
    $('#over').append(div);

}

function bindCall(){
    $('#publicImgDiv img').click(function(){
        var source = $(this).attr('src');
        publicImagePreview(source);
    });
}

//This is used for closing the preview div
function closePreview(){
    $('#over').remove();
}