$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");
    getOrganizerId(token);
    getOrganizationByOrganizerId(token);
    if(token){
        
        addOrganizer(token);
    }
});

function addOrganizer(token){

    var orgNameVal = $('#orgName').text();
    var websiteVal = $('#website').text();
    var contactVal = $('#contactNo').text();
    var addressVal = $('#address').text();

    var data = {
        "organizationName":orgNameVal,
        "organizationWebsite":websiteVal,
        "contactNumber":contactVal
    };
    data = JSON.stringify(data);

    $.ajax({
        url:  `${baseUrl}/api/organization/` ,
        type: "POST",
        crossDomain: true,
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
            addOrganizer(token);
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