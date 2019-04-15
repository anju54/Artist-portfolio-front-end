//This is used for uplaoding the profile pic
 function uploadProfilePic(token,file){

    showLoader();
    if(file!=null){

        $.ajax({

            url:  `${baseUrl}/api/media/upload/profile-pic` ,
            type: "POST",
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
                swal("profile pic  updated"); 
                showProfilePic(token);
               }   
            },
            error: function(error) {
                $('#profilePicShowError').text(error.responseJSON.message);
            },
            complete: function(){
                hideLoader();
            }         
        });
    }  
}