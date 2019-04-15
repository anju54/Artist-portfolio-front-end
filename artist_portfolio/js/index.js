var counter = 0;
$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");
    console.log(token);
    $('#sideBar').hide();
    $('#selecArtistHeader').hide();
    showAllProfilePics();   
    $('#loadMore').click(function () {
        showAllProfilePics();
    });

    if( !(token == null)){
        $('#sideBar').show();
        $('#signinButton').hide();
        // var username = window.localStorage.getItem("USERNAME");  
        // window.location.href = './profile.html?email='+username+'&val=edit' ;
    }else{
       // $('#sideBar').hide();
    }
});

function showAllProfilePics(){

    $.ajax({
        url:  `${baseUrl}/api/media/all/artist/profile-pics/${counter}/3` ,
        type: "GET",
        crossDomain: true,
        data: {},
        async: false,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (response) {
            console.log(response);
            if(response.length){
                $('#selecArtistHeader').show();
                setAllProfile(response);
                $('#loadMore').show(); 
            } else if(counter == 0){
                swal("There are No paintings!");
                $('#loadMore').hide();
            }
             else{
                swal('There are no more paintings')
                $('#loadMore').hide();
            //     $("#selecArtistHeader").hide();
             }
             
            counter++;           
        },
        error: function( error) {
            
            console.log(error);
        }             
    });
}

function setAllProfile(response){

    console.log("inside set all profile pics");
    for(var i=0; i<response.length;i++){

        // if(response.media!=null){

            var col =   '<div class="col-md-4 thumbnail img-responsive">'+
                        '<img style="height:300px" class="work" alt="'+response[i].fullName+'"'+
                        'src="'+ baseUrl + response[i].media.path + response[i].media.fileName +'" ></img>'+
                        '<a style="cursor: pointer; text-align:centre" id="'+response[i].artistProfileId+
                        '" href="./artistPublicProfile.html?id='+response[i].artistProfileId+'">'+response[i].fullName+'</a>';
                    '</div>';

        $('#publicImgDiv').append(col);
       // }
                  
    }    


}