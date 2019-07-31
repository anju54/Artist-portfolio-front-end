$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");
    if( !(token == null)){

        getUserDetail(token);
    }

    $("#loginBtn").click(function() {
        login();
    }); 
});

// This is used to get user logged in to the application
function login(){

    var emailVal = $('#email').val();
    var passwordVal = $('#password').val();
    
    if(validate()){

        var data = { "email" : emailVal,
                     "password" : passwordVal };
        data = JSON.stringify(data);  
        showLoader();

        $.ajax({
            url:  `${baseUrl}/auth/token/login` ,
            type: "POST",
            crossDomain: true,
            data: data,
            headers: {
                "Content-Type": "application/json",
            },
            success: function (response) {
      
                window.localStorage.setItem("TOKEN",response.token);       
                getUserDetail(response.token);          
            },
            error: function(error) {
                $('#error').show(); 
                $('#error').text('The email and password you entered did not match our records. Please double-check and try again');
            },
            complete: function () {
                hideLoader();
            }
        });       
    }   
}

// This is used for fetching the current logged in user information
function getUserDetail(token){

    $.ajax({
        url:  `${baseUrl}/api/artist/username` ,
        type: "GET",
        crossDomain: true,
        data: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
            console.log(response);
            redirectPage(response);
        },
        error: function( ) {
        }         
    });
}

function redirectPage(response){
    
    window.localStorage.setItem('USERNAME',response.username);  
    var loggedInUser = {
        "name" : response.fullName,
        "role" : response.userType,
        "userId" : response.userId,
        "email" : response.username
    }

    loggedInUser = JSON.stringify(loggedInUser);
    window.localStorage.setItem('loggedInUser',loggedInUser);

    if(response.userType=='ROLE_ARTIST'){
        window.location.href = './profile.html?email='+response.username+'&val=edit' ;
    }else if(response.userType=='ROLE_ORGADMIN'){
        window.location.href = './orgAdminProfile.html?email='+response.username+'&val=edit' ;
    }else if(response.userType=='ROLE_ORGSTAFF'){
        window.location.href = './orgStaffProfile.html?email='+response.username+'&val=edit' ;
    }
    
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),sParameterName,i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function hideEmail(){
    $('#emailError').hide();
    $('#error').hide();
}

function hidePassword(){
    $('#passwordError').hide();
    $('#error').hide();
}