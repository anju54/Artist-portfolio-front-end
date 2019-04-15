// $(document).ready(function() {

//     var token = window.localStorage.getItem("TOKEN");
//     $('#updateImage').hide();
//     showProfilePic(token);   

//     $("#updateImage").click(function(event) {

//         event.preventDefault();

//         var form = $('#uploadimage')[0];
//         var data = new FormData(form);
//         updateProfilePic(token,data);
//     }); 
// });

function showProfilePic(token){

    $.ajax({
        url:  `${baseUrl}/api/artist-profile/profile-pic`,
        type: "GET",
        crossDomain: true,
        data: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization','Bearer '+token);
        },
        headers: {
            "Content-Type": "application/json",
        },
        'async': false,
        success: function (response) {
            if(response!=null){
                setProfilePic(response);  
                $('#updateImage').show(); 
                $('#saveImage').hide();  
            }else{
                $('#updateImage').hide();
            }
                     
        },
        error: function( error) {
            console.log(error);
            $('#profilePicShowError').text(error.responseJSON.message);
        }             
    });
}

function setProfilePic(response){
   
    path = baseUrl + response.path + response.fileName;
    console.log(path);
    $('#profileImage').attr("src",path);
}

function updateProfilePic(token,file){
    console.log(file.length);
    if(file!=null){

        $.ajax({

            url:  `${baseUrl}/api/media/profile-pic` ,
            type: "PUT",
            enctype: "multipart/form-data",
            crossDomain: true,
            processData: false,  // it prevent jQuery form transforming the data into a query string
            contentType: false,
            data: file,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer '+ token);
            },
            success: function (response) {
                if(response!=null){
                    swal("Profile pic updated");
                }
            },
            error: function (error) {
                console.log(error);
                $('#profilePicShowError').text(error.responseJSON.message);
            },
            complete: function () {
                showProfilePic(token);
            }
        });

    }
   
    
 }