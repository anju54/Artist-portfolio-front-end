$(document).ready(function() {
   
    $('#update').hide(); 
   
    var token = window.localStorage.getItem("TOKEN");
    var username = window.localStorage.getItem("USERNAME");
    
    //getUserDetail(token);
    getAllPaintingType(token); 
    getAllColors(token);
    getArtistProfileData(token);


    $("#save").click(function() {
        saveProfileData(token);  
    });
    $("#update").click(function() {
        updateProfile(token);
    });

    $('#updateImage').hide();

    $("#updateImage").click(function(event) {

        event.preventDefault();

        var form = $('#uploadimage')[0];
        var data = new FormData(form);
        updateProfilePic(token,data);
    });

    $("#saveImage").click(function(event) {

        event.preventDefault();
        var form = $('#uploadimage')[0];
        var data = new FormData(form);
        uploadProfilePic(token,data);
    }); 
    showProfilePic(token);  
    getLoggedArtistProfile(token,username);
    
    $("#deleteImage").click(function () {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                deleteProfile(token);
                swal("Poof! Your profile pic has been deleted!", {
                    icon: "success",
                });
            } else {
                swal("Your imaginary file is safe!");
            }
        });
    });

    $('body').on('click', '#uploadimage input', function(){
        $('#imageUploadError').hide();
    });
});

// This method is used to fetch artist profile related data if it is exists
function getArtistProfileData(token){
    
    var email = window.localStorage.getItem("USERNAME");

    $.ajax({
        url:  `${baseUrl}/api/artist-profile/secured/info/${email}` ,
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
                setProfileData(response); 
                $('#save').hide();
                $('#update').show();
                
                $('#deleteImage').show();
            }             
        },
        error: function( error) {
            console.log(error);
            swal(error.responseJSON.message)
        }             
    });
}

// This is used to set artist profile data 
function setProfileData(response){

    if(response.profileName){
        $('#profileName').parent().remove();
        $("label:contains('Profile Name')").remove();
        $("#pName").show();
        $("#profileN").text(response.profileName);
    }
    $('#name').val(response.fname+" "+response.lname);
    $('#firstName').val(response.fname);
    $('#lastName').val(response.lname);
    $('#fbUrl').val(response.facebookUrl);
    $('#twitterUrl').val(response.twitterUrl);
    $('#linkedInUrl').val(response.linkedinUrl);
    $('#aboutMe').val(response.aboutMe);
    $('#email').text(response.email);
    $('#bgcol').val(response.colorName);
    var paintingTypeList = response.paintingType;
    
    for(var i=0; i<paintingTypeList.length;i++){
        var res = paintingTypeList[i].id+"_paintingType";        
       $('#'+res).prop("checked",true);
    }
}

// This is used to save artist profile data 
function saveProfileData(token){

    var email = window.localStorage.getItem("USERNAME");
    var fbUrl = $("#fbUrl").val();
    var twitterUrl = $('#twitterUrl').val();
    var linkedInUrl = $('#linkedInUrl').val();
    var aboutMe = $('#aboutMe').val();
    var profileName = $('#profileName').val();
    
   
    if(validate()){

        var paintingList = [];
        $.each($("input[name='paintingList']:checked"), function(){            
            paintingList.push($(this).val());
        });
        var color = $('#bgcol :selected').val();

        data = {
           
            "profileName":profileName,
            "facebookUrl": fbUrl,
            "twitterUrl": twitterUrl,
            "linkedinUrl": linkedInUrl,
            "aboutMe": aboutMe,
            "email":email,
            "paintingType" : paintingList,
            "colorName": color
        }
    console.log(data);
        data = JSON.stringify(data);
        showLoader();
        $.ajax({
            url:  `${baseUrl}/api/artist-profile/basic-info` ,
            type: "POST",
            crossDomain: true,
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization','Bearer '+ token);
            },
            headers: {
                "Content-Type": "application/json",
            },
            'async': false,
            success: function (response) {
            
                swal("data saved successfully!!");  
                getLoggedArtistProfile(token);      
            },
            error: function( error) {
                console.log(error.responseJSON.message);
                $('#profileNameError').show();
                $('#profileNameError').text(error.responseJSON.message)
            } ,  
            complete: function () {
                
                hideLoader();
            }            
        });
    }
    
}

// This is used to save artist profile data
function updateProfile(token){

    var email = window.localStorage.getItem("USERNAME");
    var fbUrl = $("#fbUrl").val();
    var twitterUrl = $('#twitterUrl').val();
    var linkedInUrl = $('#linkedInUrl').val();
    var aboutMe = $('#aboutMe').val();
    var lName = $('#lastName').val();
    var fName = $('#firstName').val();
    //var profileName = $('#profileName').val();
   
    var paintingList = [];
    $.each($("input[name='paintingList']:checked"), function(){            
        paintingList.push($(this).val());
    });
    var color = $('#bgcol :selected').val();

    data = {
        // "profileName":profileName,
        "fName":fName,
        "lName":lName,
        "facebookUrl": fbUrl,
        "twitterUrl": twitterUrl,
        "linkedinUrl": linkedInUrl,
        "aboutMe": aboutMe,
        "email":email,
        "paintingType" : paintingList,
        "colorName":color
    }
    console.log("calling update");
    console.log(data);
    data = JSON.stringify(data);

    $.ajax({
        url:  `${baseUrl}/api/artist-profile/basic-info/${email}` ,
        type: "PUT",
        crossDomain: true,
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization','Bearer '+ token);
        },
        headers: {
            "Content-Type": "application/json",
        },
        'async': false,
        success: function (response) {
            
            $('#msg').show();
            swal("data  updated");          
        },
        error: function( error) {
        }             
    });

}

// This is used to get logged in ArtistProfile Id
function getLoggedArtistProfile(token,username){

    $.ajax({
        url:  `${baseUrl}/api/artist-profile/loggedIn/${username}` ,
        type: "GET",
        crossDomain: true,
        data: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        headers: {
            "Content-Type": "application/json",
        },
        'async': false,
        success: function (response) {
            window.localStorage.setItem("ARTIST",response);  
        },
        error: function( ) {
            console.log(error);
        }         
    });
}

// This is used to delete profile pic
function deleteProfile(token){

    var email = window.localStorage.getItem("USERNAME");
    $.ajax({
        url:  `${baseUrl}/api/media/profile-pic/${email}` ,
        type: "DELETE",
        crossDomain: true,
        data: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
              if(response!=null){  
                $('#profileImage').attr("src","./assets/images/default-profile-pic.png");
                // $('#updateImage').hide();
                // $('#saveImage').show();
              }
        },
        error: function( ) {
        }         
    });
}

function redirectArtistPublicProfile(){

    var id = window.localStorage.getItem("ARTIST");
    $('#previewProfile').attr("href","./artistPublicProfile.html?id="+id);
}

// this is used for validation the form
function validate(){
    
    // var fname = $('#fname').val();
    var profileNameVal = $('#profileName').val();
    var colorVal = $('#bgcol :selected').val();
    
    if(  isEmpty("Profile Name", profileNameVal) && isEmpty("color", colorVal) ) {
        return true;
    } else return false;
}

// check for empty
function isEmpty(field, data){
    
    var error = "";
   
    if (data === ''|| data === null || data === undefined || data === "Select") {
        console.log(data);
        error = "You didn't enter "+field+".";
        if(field=="Profile Name"){
            $('#profileNameError').show();
            $('#profileNameError').text(error);
        }else if(field=="First Name"){
            $('#fnameError').show();
            $('#fnameError').text(error);
        }else if(field =="color"){
            $('#colorError').show();
            $('#colorError').text(error);
        }
        return false;
    } 
    return true;
}

function hideError(){
    $('#profileNameError').hide();
}