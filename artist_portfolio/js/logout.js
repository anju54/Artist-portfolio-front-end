// this method is used to map the logout feature
$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");
    $("#logout").click(function(event) {
        $('#logout').attr("href","./index.html");
        logout(token);
    }); 
    
 });

 //This is used for calling the ajax call for logout
function logout(token){
    
    $.ajax({
        url: `${baseUrl}/api/user-logout`,
        type: "GET",
        crossDomain: true,
        headers: {
            "Content-Type": "application/json",
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization','Bearer '+token);
        },
        'async': false,
        success: function (result) {
            swal("successfuly logout from the application");
           
        } ,
        complete: function () {
            window.localStorage.removeItem("TOKEN");
            window.localStorage.removeItem("ARTIST");
            window.localStorage.removeItem("USERNAME");
            window.localStorage.removeItem("ORGANIZATION");
            window.localStorage.removeItem("ORGANIZATIONID");
            window.localStorage.removeItem("loggedInUser");
            window.localStorage.removeItem("USERID");
           
        }    
    });   
}