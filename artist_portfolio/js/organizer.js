$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");
    if(token){
        
        getOrganizerId(token);
        
    }
});

//This method is used to organization detail
function getOrganizationByOrganizerId(token){

    var id = window.localStorage.getItem("ORGANIZERID");
    $.ajax({
        url:  `${baseUrl}/api/organizer/${id}/organization` ,
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
                console.log(response);
                setOrganizationData(response);
            }             
        },
        error: function( error) {
            console.log(error);
        }             
    });
    
}

function setOrganizationData(response){

    $('#orgName').val(response.organizationName);
    $('#website').val(response.organizationWebsite);
    $('#conatctNo').val(response.contactNumber);
    $('#address').val(response.organizationAddress);

}

//This method is used to get organizer id
function getOrganizerId(token){

    $.ajax({
        url:  `${baseUrl}/api/organizer/id` ,
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
                window.localStorage.setItem("ORGANIZERID",response); 
            }             
        },
        error: function( error) {
            console.log(error);
        }             
    });
}

function addOrganizer(token){

    var orgNameVal = $('#orgName').text();

    $.ajax({
        url:  `${baseUrl}/api/organizer/new?organization=${orgNameVal}` ,
        type: "POST",
        crossDomain: true,
        data: {},
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