$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");
    getOrganizerId(token);

    var id = window.localStorage.getItem("ORGANIZERID");
    if(id){
        getOrganizationByOrganizerId(token);
    }
    
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
            url:  `${baseUrl}/api/organization/` ,
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
            complete: function(){
                 hideLoader();
            }        
        });
    }
    
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
    var id = window.localStorage.getItem("ORGANIZATIONID");

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
                getOrganizationByOrganizerId(token); 
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
}

function hideErrCn(){
    $('#errCN').hide();
}

function hideErrWebsite(){
    $('#errWebsite').hide();
}

function hideDomainErr(){
    $('#domainErr').hide();
}