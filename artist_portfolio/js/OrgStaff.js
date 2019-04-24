$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");
    if(token){
        
        addStaff(token);
    }
});

//This is used for adding organization staff
function addStaff(token){

    var orgNameVal = $('#orgName').text();
    var firstNameVal = $('#staffFirstName');
    var lastNameVal = $('#stafflastName');
    var emailVal = $('#email');

    var data = {
        "email":emailVal,
        "organizationName":orgNameVal
    }
    data = JSON.stringify(data);

    $.ajax({
        url:  `${baseUrl}/api/orgStaff/` ,
        type: "POST",
        crossDomain: true,
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
              
        },
        headers: {
            "Content-Type": "application/json",
        },
        'async': false,
        error: function(error) {
            console.log(error);
        }         
    });
}