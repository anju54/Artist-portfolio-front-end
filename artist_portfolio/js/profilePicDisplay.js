//This is used for making ajax call displaying the profile pic
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
            if(response){
                console.log("--------------");
                console.log(response);
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

//This is used to set the profile pic
function setProfilePic(response){
   
    path = baseUrl + response.path + response.fileName;
    console.log(path);
    $('#profileImage').attr("src",path);
}

//This is used for making ajax call for updating the profile pic
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