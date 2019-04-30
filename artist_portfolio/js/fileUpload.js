//This is used for uplaoding the profile pic
 function uploadProfilePic(token,file,type){

    if(type=="artist"){
        var urlValue = `${baseUrl}/api/media/upload/profile-pic`;
    }else if(type=="org-staff"){
        var urlValue = `${baseUrl}/api/orgStaff/upload/profile-pic`;
    }else if(type=="org-admin"){
        var urlValue = `${baseUrl}/api/organizer/upload/profile-pic`;
    }

    $('#profilePicShowError').text('');
   // hideLoader();
    showLoader();
    if(file!=null){

        $.ajax({

            url: urlValue ,
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
                $('#deleteImage').show();
               }   
            },
            error: function(error) {
                $('#profilePicShowError').text(error.responseJSON.message);
                
            },
            complete: function(){
        
                $('#file').val('');
                $('#profilePicShowError').text('');
                hideLoader();
            }         
        });
    }  
}