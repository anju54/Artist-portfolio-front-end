$(document).ready(function() {

    var loggedInUser = window.localStorage.getItem("loggedInUser");
    loggedInUser = JSON.parse(loggedInUser);
    var fullName = loggedInUser.name;
    fullName = fullName.split(" ");
    $("#firstName").text(fullName[0]) ;

    var token = window.localStorage.getItem("TOKEN");
    getOrganizationById(token);
    getDomainByOrganizerId(token);
    // getOrganizerId(token);

    // var id = window.localStorage.getItem("ORGANIZERID");
    // if(id){
    //    getOrganizationByStaffId(token);
    // }
    
    $('#regOrg').click(function(){
        addOrganization(token);
    });

    $('#updateOrg').click(function(){
        updateOrganization(token);
    });

    $('#addMore').click(function(){
        addDomain(token);
    });
});

/**
 * This is used to get organization by id
 * @param id
 *      organization id
 */
function getOrganizationById(token){

    var organization =JSON.parse(  window.localStorage.getItem("ORGANIZATION") );

    $.ajax({
        
        url:  `${baseUrl}/api/organization/${organization.id}` ,
        type: "GET",
        crossDomain: true,
        data: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization','Bearer '+token);
        },
        'async': false,
        success: function (response) {
            console.log(response);
            setOrganizationData(response);
        },
        error: function( error) {  
        }             
    });

}
function setOrganizationData(response){

    $('#orgName').text(response.organizationName);
    $('#orgName').val(response.organizationName);
    $('#website').val(response.organizationWebsite);
    $('#cn').val(response.contactNumber);
    $('#address').val(response.organizationAddress);
}

function addOrganization(token){

    var loggedInUser = window.localStorage.getItem("loggedInUser");
    loggedInUser = JSON.parse(loggedInUser);
    var email = loggedInUser.email;

    var orgNameVal = $('#orgName').val();
    var websiteVal = $('#website').val();
    var contactVal = $('#cn').val();
    var addressVal = $('#address').val();
    var domain = $('#domain').val();

    var data = {
        "orgName":orgNameVal,
        "website":websiteVal,
        "orgAddress":addressVal,
        "contactNo":contactVal,
        "domainName":domain
    };
   
    data = JSON.stringify(data);
    
    if(formValidation()){
        showLoader();
        $.ajax({
            url:  `${baseUrl}/api/organization/${email}` ,
            type: "POST",
            crossDomain: true,
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer '+ token);
            },
            success: function (response) {
                //addOrganizer(token);
                swal("organization registered successfully!!");
                 //getDomainByOrganizerId(token);

            },
            headers: {
                "Content-Type": "application/json",
            },
            'async': false,
            error: function(error) {
                hideLoader(); 
            }   ,
            complete: function(error){
                 hideLoader();
                 $('#saveOrgErr').show();
                 $('#saveOrgErr').text(error.responseJSON.message);
            }        
        });
    }
    
}

function updateOrganization(token){

    var organization =JSON.parse(  window.localStorage.getItem("ORGANIZATION") );
    var id = organization.id;

    var orgNameVal = $('#orgName').val();
    var websiteVal = $('#website').val();
    var contactVal = $('#cn').val();
    var addressVal = $('#address').val();

    var data = {
        "organizationName":orgNameVal,
        "organizationWebsite":websiteVal,
        "organizationAddress":addressVal,
        "contactNumber":contactVal
    };
   
    data = JSON.stringify(data);
    
    if(formValidation()){
        showLoader();
        $.ajax({
            url:  `${baseUrl}/api/organization/${id}` ,
            type: "PUT",
            crossDomain: true,
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer '+ token);
            },
            success: function (response) {
                //addOrganizer(token);
                swal("organization updated successfully!!");
                 //getDomainByOrganizerId(token);

            },
            headers: {
                "Content-Type": "application/json",
            },
            'async': false,
            error: function(error) {
                hideLoader(); 
            }   ,
            complete: function(error){
                 hideLoader();
                 var errMsg = error.responseJSON.message;
                 if(errMsg.includes("website")){

                    $('#errWebsite').show();
                    $('#errWebsite').text(errMsg);
                 }else if(errMsg.includes("Organization")){
            
                    $('#errName').show();
                    $('#errName').text(errMsg);
                }else if(errMsg.includes("contact")){

                    console.log(data);
                    $('#errCN').show();
                    $('#errCN').text(errMsg);
                }else{

                    $('#saveOrgErr').show();
                    $('#saveOrgErr').text(errMsg);
                }
                
            }        
        });
    }

}

/**
 * This is used to get list of domain by organizer id
 * @param {*} token 
 */
function getDomainByOrganizerId(token){

    var organization =JSON.parse(  window.localStorage.getItem("ORGANIZATION") );
    var id = organization.id;

    $.ajax({
        url:  `${baseUrl}/api/domain/organization/${id}` ,  //organizerid
        type: "GET",
        crossDomain: true,
        data: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
            processDomainData(response);
        },
        error: function(error) {
        }         
    });
}

function processDomainData(response){

    var resultString = "";
    for(var i=0;i<response.length;i++){
         resultString = resultString + response[i].domainName +",";
    }
    
    resultString = resultString.substr(0,resultString.length-1);
    $('#domainName').text(resultString);
}

/**
 * This is used to add new domain
 * @param {*} token 
 */
function addDomain(token){

    //showLoader();
    var organization =JSON.parse(  window.localStorage.getItem("ORGANIZATION") );
    var id = organization.id;

    var domainVal = $('#domain').val();

    var data = {"domainName":domainVal};
    data = JSON.stringify(data);
    
    $.ajax({
        url:  `${baseUrl}/api/domain/organization/${id}` , //organizationId
        type: "POST",
        crossDomain: true,
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
            if(response){
                swal("domain created successfully!!");   
               getOrganizationByStaffId(token); 
            }
        },
        headers: {
            "Content-Type": "application/json",
        },
        'async': false,
        error: function(error) {
            
            $('#domainErr').show();
            $('#domainErr').text(error.responseJSON.message);
        } ,
        complete: function () {
            //hideLoader();
        }        
    });
}

function formValidation(){
    
    var orgNameVal = $('#orgName').val();
    var websiteVal = $('#website').val();
    var contactVal = $('#cn').val();
    var addressVal = $('#address').val();
    var domain = $('#domain').val();

    if( isEmpty("Organization Name",orgNameVal) && isEmpty("Organization website",websiteVal)
     && isEmpty("Organization contactNumber",contactVal) &&isURLvalid("Organization website",websiteVal)) {
        return true;

    } else return false;

}

// check for empty
function isEmpty(field, data){
    var error = "";
    
    if (data === ''|| data === null || data === undefined) {
        error = "You didn't enter "+field+".";

        if(field=="Organization Name"){
            
            $('#errName').show();
            $('#errName').text(error);
        }else if(field=="Organization website"){
            $('#errWebsite').show();
            $('#errWebsite').text(error);
        }else if(field=="Organization contactNumber"){
            console.log(data);
            $('#errCN').show();
            $('#errCN').text(error);
        }
        
        return false;
    } 
    return true;
}


function isURLvalid(field,data){
    
    var urlPattern = new RegExp(''+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    
    var error = "";

    //if (data === ''|| data === null || data === undefined)return true;
    if(urlPattern.test(data)){
        return true;
    }else{
        
        error = "you entered wrong "+field+" URL!!";
        $('#errWebsite').show();
        $('#errWebsite').text(error);
        return false;
    }  
    
}

function hideErrOrgName(){
    $('#errName').hide();
    $('#saveOrgErr').hide();
}

function hideErrCn(){
    $('#errCN').hide();
    $('#saveOrgErr').hide();
}

function hideErrWebsite(){
    $('#errWebsite').hide();
    $('#saveOrgErr').hide();
}

function hideDomainErr(){
    $('#domainErr').hide();
    $('#saveOrgErr').hide();
}

