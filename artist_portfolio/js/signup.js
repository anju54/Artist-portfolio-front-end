$(document).ready(function() {

    $("#signUp").click(function() {
        registration();
    }); 
});

// This is used for making ajax call for registration
function registration(){

    var emailVal = $('#email').val();
    var fNameVal = $('#fname').val().replace(/[^a-zA-Z0-9]/g, '');
    var lNameVal = $('#lname').val().replace(/[^a-zA-Z0-9]/g, '');
    var usertypeVAl = $("input[name='userType']:checked").val();

    console.log(usertypeVAl);
    //var usertypeVAl = 'ARTIST';

    if(validate()){

        var data = {
            "fname" : fNameVal,
            "lname" : lNameVal,
            "email" : emailVal,
            "roleName": usertypeVAl
            };
       
        data = JSON.stringify(data);
        showLoader();
        // return false;
        $.ajax({

            url:  `${baseUrl}/api/artist/registration` ,
            type: "POST",
            crossDomain: true,
            data: data,
            headers: {
                "Content-Type": "application/json",
            },
            success: function (response) {
                
                $('#msg').text("Congratulations!! account has been created successfully! check email for login credentail");
            },
            error: function(error) {
            },
            complete: function () {
                hideLoader();               
            }
        });
    }  
}

// This is used fir hiding the error tag after giving the input
function hideFnameFunction(){
    $('#fnameError').hide();
}
function hideLnameFunction(){
    $('#lnameError').hide();
}
function hideEmailFunction(){
    $('#emailErrorMsg').hide();
}