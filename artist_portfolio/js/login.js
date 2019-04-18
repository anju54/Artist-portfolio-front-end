$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");

    if( !(token == null)){

        var username = window.localStorage.getItem("USERNAME");  
        window.location.href = './profile.html?email='+username+'&val=edit' ;
    }

    $("#loginBtn").click(function() {
        //$('#error').show();
        login();
    }); 
});

function login(){

    var emailVal = $('#email').val();
    var passwordVal = $('#password').val();
    
    if(validate()){

        var data = {
            "email" : emailVal,
            "password" : passwordVal
                };
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
            //setCookie('USER', response, 1); 
            redirectPage(response.username);  
    
        },
        error: function( ) {
        }         
    });
}

function redirectPage(username){
    
    window.localStorage.setItem('USERNAME',username);  
    window.location.href = './profile.html?email='+username+'&val=edit' ;
}

// used to set  cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    
}

// This is used to get cookie value
function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
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