$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");

    $('#updateImage').hide();

    var type = "org-staff";

    showProfilePic(token);

    $("#saveImage").click(function(event) {

        event.preventDefault();
        var form = $('#uploadimage')[0];
        var data = new FormData(form);
        uploadProfilePic(token,data,type);
    }); 

    $("#updateImage").click(function(event) {

        event.preventDefault();

        var form = $('#uploadimage')[0];
        var data = new FormData(form);
        updateProfilePic(token,data,type);
    });
});

//This is used for making ajax call displaying the profile pic
function showProfilePic(token){
console.log("inside show profile pic");
    $.ajax({
        url:  `${baseUrl}/api/orgStaff/profile-pic`,
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
            console.log(response);
            if(response){
               
                setProfilePic(response);  
                $('#updateImage').show(); 
                $('#saveImage').hide(); 
                $('#deleteImage').show(); 
            }else{
                $('#saveImage').show(); 
                $('#deleteImage').hide();
                $('#updateImage').hide();
            }          
        },
        error: function( error) {
            
            $('#profilePicShowError').text(error.responseJSON.message);
        }             
    });
}

//This is used to set the profile pic
function setProfilePic(response){
   
    path = baseUrl + response.path + response.fileName;
    $('#profileImage').attr("src",path);
}
