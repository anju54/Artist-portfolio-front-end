var counter = 0;
$(document).ready(function() {

    // var token = window.localStorage.getItem("TOKEN");
    var id = getUrlParameter('id');
    showPublicPaintings(id); 
    $('#loadMore').click(function () {
        showPublicPaintings(id); 
    });
      
});

function showPublicPaintings(id){

    $.ajax({
        url:  `${baseUrl}/api/media/public-albums/artist?id=${id}&pageNo=${counter}&pageLimit=4` ,
        type: "GET",
        crossDomain: true,
        data: {},
        async: false,
        // beforeSend: function (xhr) {
        //     xhr.setRequestHeader('Authorization','Bearer '+token);
        // },
        headers: {
            "Content-Type": "application/json",
        },
        success: function (response) {
            if(response.mediaList.length){
                console.log(response);
                setAllPaintings(response); 
                $('#loadMore').show(); 
            } else if(counter == 0){
               swal("There are No paintings!");
            } else{
                swal('There are no more paintings')
                $('#loadMore').hide();
            }
             
            counter++;            
        },
        error: function( error) {
            console.log(error);
        }             
    });
     
}

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