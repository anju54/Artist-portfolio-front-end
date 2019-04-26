$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");
    getOrganizerId(token);
    getOrganizationByOrganizerId(token);

    $('#regOrg').click(function(){
        addOrganization(token);
    });

    $('#addMore').click(function(){
        addDomain(token);
    });
});

function addOrganization(token){

    var orgNameVal = $('#orgName').val();
    var websiteVal = $('#website').val();
    var contactVal = $('#contactNo').val();
    var addressVal = $('#address').val();
    var domain = $('#domain').val();

    var data = {
        "orgName":orgNameVal,
        "website":websiteVal,
        "orgAddress":addressVal,
        "contactNo":contactVal,
        "domainName":domain
    };
    console.log(data);
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
            //addOrganizer(token);
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

/**
 * This is used to get list of domain by organizer id
 * @param {*} token 
 */
function getDomainByOrganizerId(token){

    var id = window.localStorage.getItem("ORGANIZERID");

    $.ajax({
        url:  `${baseUrl}/api/domain/organizer/${id}` ,  //organizerid
        type: "GET",
        crossDomain: true,
        data: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
            console.log(response);
            //$('#domainName').text(response[0].domainName);
            processDomainData(response);
        },
        error: function(error) {
            console.log(error);
        }         
    });
}

function processDomainData(response){

    var resultString = "";
    for(var i=0;i<response.length;i++){
         resultString = resultString + response[i].domainName +",";
    }
    console.log(resultString);
    resultString = resultString.substr(0,resultString.length-1);
    $('#domainName').text(resultString);
}

/**
 * This is used to add new domain
 * @param {*} token 
 */
function addDomain(token){

    //showLoader();
    var id = window.localStorage.getItem("ORGANIZATIONID");

    var domainVal = $('#domain').val();

    var data = {"domainName":domainVal};
    data = JSON.stringify(data);
    console.log(data);
    $.ajax({
        url:  `${baseUrl}/api/domain/organization/${id}` , //organizationId
        type: "POST",
        crossDomain: true,
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
          swal("domain created successfully!!");   
          getOrganizationByOrganizerId(token); 
        },
        headers: {
            "Content-Type": "application/json",
        },
        'async': false,
        error: function(error) {
            console.log(error);
        } ,
        complete: function () {
            //hideLoader();
        }        
    });
}