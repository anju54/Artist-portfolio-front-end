$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");
    getUserDetail(token);
});

// This method is used to get principal user information.
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
            window.localStorage.setItem("USERID",response.userId);       
            $("#email").val(response.username) ;
            setName(response.fullName);    
        },
        error: function( ) {
        }         
    });
}

// This method is used to set user data to the text field
function setName(fullName){
    console.log(fullName);
    $("#fullName").text(" "+fullName) ;
    $("#name").text(fullName) ;
    var fullNameSplit = fullName.split(" ");
    $("#firstName").text(fullNameSplit[0]) ;
    $("#fName").val(fullNameSplit[0]) ;
    $("#lastName").val(fullNameSplit[1]) ;
       
   

}

// method to get url parameter
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

