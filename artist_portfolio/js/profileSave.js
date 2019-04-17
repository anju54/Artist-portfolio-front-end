$(document).ready(function() {
   
    $('#update').hide(); 
    $("#saveImage").hide();
   
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
   
    var id = window.localStorage.getItem("ARTIST");
    if(id==0){
        console.log("calling getLoggedArtistProfile if ARTIST is 0")
        getLoggedArtistProfile(token,username);  
    }
    
    getLoggedArtistProfile(token,username); 

    if(id>0){
        showProfilePic(token);
    }

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
    //console.log(paintingTypeList);

    var list = "" ;
    for(var i=0; i<paintingTypeList.length;i++){

        var res = paintingTypeList[i].id+"_paintingType";        
       $('#'+res).prop("checked",true);

        list += paintingTypeList[i].paintingName + ",";
        console.log(list);
    }
    if(list.length > 50){
        
        var res = list.substr(0,50);
        res += "...."; 
        $('#optionPaintingType').text(res);
    }else{
        var length = list.length;
        //var indexVal = list.indexOf(",");
        var result = list.substr(0,length-1);
        $('#optionPaintingType').text(result);
    }
    
}

// This is used to save artist profile data 
function saveProfileData(token){

   $('#msg').text('');

    var email = window.localStorage.getItem("USERNAME");
    var fbUrl = $("#fbUrl").val();
    var twitterUrl = $('#twitterUrl').val();
    var linkedInUrl = $('#linkedInUrl').val();
    var aboutMe = $('#aboutMe').val();
    var profileName = $('#profileName').val();
    
   
    if(validate("save")){

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
                
                window.localStorage.setItem("ARTIST",response);  
                swal("data saved successfully!!");  
                getLoggedArtistProfile(token);    
                showProfilePic(token) ;
                $("#saveImage").show();
                //getArtistProfileData(token);
            },
            error: function( error) {

                var errorMsg = error.responseJSON.message;

                if(errorMsg.includes("Profile")){
                    $('#profileNameError').show();
                    $('#profileNameError').text(error.responseJSON.message)
                }if(errorMsg.includes("Facebook")){
                    $('#fbError').show();
                    $('#fbError').text(errorMsg);
                }else if(errorMsg.includes("Twitter")){
                    $('#tError').show();
                    $('#tError').text(errorMsg);
                }else if(errorMsg.includes("LinkdIn")){
                    $('#lError').show();
                    $('#lError').text(errorMsg);
                }
                else{
                    $('#msg').show();
                    $('#msg').text(errorMsg);
                }
            },  
            complete: function () {
                
                hideLoader();
            }            
        });
    }  
}

// This is used to save artist profile data
function updateProfile(token){

    $('#msg').text('');
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

    if(validate("update")){

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
            error: function(error) {
                var err = error.responseJSON.message;
                if(err.includes("Facebook")){
                    $('#fbError').show();
                    $('#fbError').text(err);
                }else if(err.includes("Twitter")){
                    $('#tError').show();
                    $('#tError').text(err);
                }else if(err.includes("linkdIn")){
                    $('#lError').show();
                    $('#lError').text(err);
                }
                else{
                    $('#msg').show();
                    $('#msg').text(error.responseJSON.message);
                    console.log(error.responseJSON.message);
                }
                
            }             
        });
    }
    

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
            if(response){

                window.localStorage.setItem("ARTIST",response);  
                console.log(response);
                var existingArtist = window.localStorage.getItem("ARTIST");
                showProfilePic(token);    
            }  
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
                $('#updateImage').hide();
                $('#saveImage').show();
                $('#deleteImage').hide();
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
function validate(type){
    
    // var fname = $('#fname').val();
    var profileNameVal = $('#profileName').val();
    var colorVal = $('#bgcol :selected').val();

    var fbUrl = $("#fbUrl").val();
    var twitterUrl = $('#twitterUrl').val();
    var linkedInUrl = $('#linkedInUrl').val();

    if(type=="save"){

        if(  isEmpty("Profile Name", profileNameVal) && isEmpty("color", colorVal) ) {          
        
            if(isURLvalid("Facebook",fbUrl) && isURLvalid("twitter",twitterUrl) 
                && isURLvalid("LinkedIn",linkedInUrl)){
                    return true;
                }else{
                    return false;
                }
        
        } else return false;
    }else{

        if(isEmpty("color", colorVal) ) {         
       
            if(isURLvalid("Facebook",fbUrl) && isURLvalid("twitter",twitterUrl) 
            && isURLvalid("LinkedIn",linkedInUrl)){
                return true;
            }else{
                return false;
            }
        } else return false;
    }
    
   
}

// check for empty
function isEmpty(field, data){
    
    var error = "";
   
    if (data === ''|| data === null || data === undefined || data === "Select") {
        
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
    $('#profilePicShowError').hide();
}

function hidefbError(){
    $('#fbError').text('');
}

function hideTError(){
    $('#tError').text('');
}

function hideLError(){
    $('#lError').text('');
}

function hideMainError(){
    $('#msg').hide();
}

function hideColorError(){
    $('#colorError').hide();
}

function isURLvalid(field,data){
    
    var facebookUrlPattern =/^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i;
    var twitterUrlPattern = /^(https?:\/\/)?((w{3}\.)?)twitter\.com\/(#!\/)?[a-z0-9_]+$/i;
    var linkedinUrlPattern = /(ftp|http|https):\/\/?(?:www\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    
    // /^(https?:\/\/)?((w{3}\.)?)linkedin.com\/.*/i;
    
    var error = "";

    if(field=="LinkedIn"){
       
        if (data === ''|| data === null || data === undefined)return true;
        if(data.match(linkedinUrlPattern)){
            return true;
        }else{
            error = "you entered wrong "+field+" URL!!";
            $('#lError').show;
            $('#lError').text(error);
            return false;
        }  
    }else if(field=="Facebook"){
        if (data === ''|| data === null || data === undefined)return true;
        if(data.match(facebookUrlPattern)){
           
            return  true;
        }else{
            error = "You entered wrong "+field+" URL!!";
            $('#fbError').show;
            $('#fbError').text(error);
            return false;
        }
    }else if(field=="twitter"){
        if (data === ''|| data === null || data === undefined)return true;
        if(data.match(twitterUrlPattern)){
           
           return true;
        }else{
            console.log(data);
            error = "You entered wrong "+field+" URL!! ";
            $('#tError').show;
            $('#tError').text(error);
            return false;
        }
    }
}