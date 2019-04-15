var counter = 1;
var c = 0;
var paintingList = [];
$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");
    showPaintings(token);   
    $('#loadMore').click(function () {
        showPaintings(token);
    });

    // $('input[name=publicOrPrivate]').change( function(){
    //     var id = $(this).attr('id');
    //     setPublicOrprivate(token,id);
    // });

});

function bindEvent(){

    var token = window.localStorage.getItem("TOKEN");
    $('#imgDiv img').click(function(){
        var source = $(this).attr('src');
        imagePreview(source);
     });

     $('input[name=publicOrPrivate]').change( function(){
        var id = $(this).attr('id');
        setPublicOrprivate(token,id);
    });

     $(".deleteBtn").click(function () {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    var id = this.id;
                    deletePainting(token,id);
                    swal("Poof! Your profile pic has been deleted!", {
                        icon: "success",
                    });
                } else {
                    swal("Your file is safe!");
                }
            });

            // var id = this.id;
            // deletePainting(token,id);
    });
}

// This is used to fetch all the painting of a particular artist
function showPaintings(token){
    $.ajax({
        url:  `${baseUrl}/api/media/artist/albums/${counter}/6` ,
        type: "GET",
        crossDomain: true,
        data: {},
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization','Bearer '+token);
        },
        headers: {
            "Content-Type": "application/json",
        },
        success: function (response) {
            console.log(response);
            if(response.length){
               for(var i=0; i<response.length; i++){
                   if(JSON.stringify(paintingList).indexOf(JSON.stringify(response[i])) === -1){
                       paintingList.push(response[i]);
                   }
               }
               $('#imgDiv').empty();
                setAllPaintings(paintingList);
                $('#loadMore').show(); 
            } else if(counter == 0){
                swal("There are No paintings!");
            } else {
                $('#loadMore').hide();
            }
             
            counter++; 
            bindEvent();          
        },
        error: function( error) {
            
            console.log(error);
        }             
    });
     
}

// This is used to create img tag for displaying painting
function setAllPaintings(response){
    console.log('called');
    for(var i=0; i<response.length;i++){

		var divid; 
        if (i%2 === 0) {
            divid= 'row'+c;
            c++;
            var row = '<div class="row" id="'+divid+'"></div>';
            $('#imgDiv').append(row);
        }

        var col =  '<div class=col-md-5>'+
        '<div class = "well">'+
            '<img style="height:200px" class="thumbnail img-responsive" alt="opps!! imgae is not loaded"'+
                'src="'+baseUrl + response[i].media.pathThumb+response[i].media.fileName+'" />'+
                '<input type="checkbox" name="publicOrPrivate" class="form-check-input" id="'+response[i].media.id+"_isPublic"+'">Public?'+
                '<button class="btn btn-success deleteBtn" id="'+response[i].media.id+ '"'+
                '">Delete</input>';
                '</div></div>';
                
        $('#'+divid).append(col);
        var isPublic = response[i].publicImage;
        if(isPublic=='true'){
            $('#'+response[i].media.id+'_isPublic').prop('checked',true);
        } else $('#'+response[i].media.id+'_isPublic').prop('checked',false);
    }
}

// This is used to preview when user hover the image to see the full image
function imagePreview(source){
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

// This is used for closing the preview option
function closePreview(){
    $('#over').remove();
}

//This is used to set public or private the images 
function setPublicOrprivate(token, id){

    var isPublic;
    
    if ( $('#'+id).is(":checked")){
            isPublic = "true";
    }else{
            isPublic = "false";
    }
    var i = id.indexOf("_");
    var mediaId =  id.substring(0,i);

    $.ajax({
        url:  `${baseUrl}/api/media/isPublic/${isPublic}/${mediaId}` ,
        type: "PUT",
        crossDomain: true,
        data: {},
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization','Bearer '+ token);
        },
        headers: {
            "Content-Type": "application/json",
        },
        success: function (response) {
            console.log(response);
                 
        },
        error: function( error) {
            console.log(error);
        }             
    });
}

// This is used to delete the painting
function deletePainting(token,id){
    $.ajax({
        url:  `${baseUrl}/api/media/${id}` ,
        type: "DELETE",
        crossDomain: true,
        data: {},
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
            //console.log(response);     
        },
        error: function( ) {
        }  ,
        complete: function () {
            $('#imgDiv').empty();
            for(var i=0; i<paintingList.length; i++){
                if(paintingList[i].media.id == id){
                    console.log('ggggg');
                    paintingList.splice(i,1);
                }
            }
             setAllPaintings(paintingList);
             bindEvent();
           
        }         
    });
}