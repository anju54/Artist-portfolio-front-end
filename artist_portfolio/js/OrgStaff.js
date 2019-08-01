var actionForStaff = "save";
$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");

    var loggedInUser = window.localStorage.getItem("loggedInUser");
    loggedInUser = JSON.parse(loggedInUser);
    var fullName = loggedInUser.name;
    fullName = fullName.split(" ");
    $("#firstName").text(fullName[0]) ;
    
    $('#regOrgStaff').click(function(){
        addStaff(token);
    });

   getAllStaff(token);
    
   var id = getUrlParameter('id');
   if(id){
        actionForStaff = "update";
        $('#roleDiv').empty();
        getStaffDetailByStaffId(id,token);
   }
});

//This is used for adding organization staff
function addStaff(token){

    var orgNameVal = $('#orgName').text();
    var firstNameVal = $('#staffFirstName').val();
    var lastNameVal = $('#stafflastName').val();
    var emailVal = $('#staffEmail').val();
    var usertypeVAl = $("input[name='userType']:checked").val();

    var data = {

        "email":emailVal,
        "fName":firstNameVal,
        "lName":lastNameVal,
        "organizationName":orgNameVal,
        "roleName":usertypeVAl
    }
   
    if(usertypeVAl=="ROLE_ORGSTAFF" && actionForStaff == "save"){

        var urlValue = `${baseUrl}/api/orgStaff/`;

    }else if(usertypeVAl=="ROLE_ORGADMIN" && actionForStaff == "save"){ 

        var urlValue = `${baseUrl}/api/organizer/user?organization=${orgNameVal}`;
        // delete data["organizationName"];
        data = {
            "email":emailVal,
            "fname":firstNameVal,
            "lname":lastNameVal,
            "roleName":usertypeVAl
        }
    }else if(usertypeVAl=="ROLE_ORGSTAFF" && actionForStaff == "update"){
        var id = getUrlParameter('id');
        var urlValue = `${baseUrl}/api/orgStaff/${id}`;
    }
    data = JSON.stringify(data);
    console.log(data); 
    console.log(urlValue);
    console.log(actionForStaff);
    
    if(validation()){
        $('.swal-overlay').hide();
        showLoader();
        $.ajax({
            url:  urlValue ,
            type: "POST",
            crossDomain: true,
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer '+ token);
                
            },
            success: function (response) {
                hideLoader();
                $('.swal-overlay').show();
                swal("data saved successfully!!"); 
                window.location.href = './ManageStaff.html';   
            },
            headers: {
                "Content-Type": "application/json",
            },
            'async': false,
            error: function(error) {
                hideLoader();
                $('#saveError').show();
                $('#saveError').text(error.responseJSON.message);
                
            } ,
            complete: function () {
                hideLoader();
            }        
        });
    }
}
// $(document).ajaxStart(function(){
//     showLoader();
// });
// $(document).ajaxStop(function(){
//     hideLoader();
// });

// This is used to get all staff of organization
function getAllStaff(token){

    var organization =JSON.parse(  window.localStorage.getItem("ORGANIZATION") );
    $.ajax({
        
        url:  `${baseUrl}/api/orgStaff/all/organization/${organization.id}` ,
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
                
                populateStaffData(response);
            }             
        },
        error: function( error) {
           
        }             
    });
}

// This is used for populating staff data
function populateStaffData(response){
  
    $('#staffData tbody').empty();
    var role;
    let tableRow = '<tr>'
                 + '<td>'+response.fName+'</td>'
                 + '<td>'+response.lName+'</td>'
                 + '<td>'+response.email+'</td>'
                 + '<td>'+response.roleName+'</td>'
                 + '</tr>';

    for(var i=0; i<response.length;i++){

        role = response[i].roleName.substr(5,response[i].roleName.length);
        
        tableRow = '<tr>'
                    + '<td>'+response[i].fName+'</td>'
                    + '<td>'+response[i].lName+'</td>'
                    + '<td>'+response[i].email+'</td>'
                    + '<td>'+role+'</td>'
                    +  '<td><button type="button" onclick="editStaff([staffId])" class="btn btn-success btn-sm editDelBtn"><img src="https://img.icons8.com/material/10/000000/edit.png"></i></button>'
                    +   '<button type="button" onclick="deleteStaffConfirmation([staffIdVal])" class="btn btn-success btn-sm editDelBtn"><img src="https://img.icons8.com/material/10/000000/delete-sign.png"></button>'     
                    + '</td>'
                    + '</tr>';
        tableRow = tableRow.replace('[staffId]',response[i].orgStaffId);
        tableRow = tableRow.replace('[staffIdVal]',response[i].orgStaffId);
       
        $('#staffData tbody').append(tableRow);
    }
    
}

function deleteStaffConfirmation(id){

    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                
                deleteStaff(id);
                swal(" Your record has been deleted!", {
                    icon: "success",
                });
            } else {
                swal("Your data is safe!");
            }
        });
}

function deleteStaff(id){

    var token = window.localStorage.getItem("TOKEN");

    $.ajax({
        url:  `${baseUrl}/api/orgStaff/${id}` ,
        type: "DELETE",
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
            
            getAllStaff(token);     
        },
        error: function( error) {
            
        }             
    });
}

function editStaff(id){

    $('#updateOrgStaff').show();
    
    $('#roleDiv').empty();
    window.location.href = 'addstaff.html?id='+id;
}

function redirectPage(){

    $('#addStaffBtn').attr("href","./orgStaffRegistration.html");
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

// This is used to get staff detail
function getStaffDetailByStaffId(email,token){

    $.ajax({
        url:  `${baseUrl}/api/orgStaff/${email}` ,
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
           
            $('#updateOrgStaff').show();
            
            $('#newRegHeader').text("");
            $('#orgName').text();
            $('#staffFirstName').val(response.fName);
            $('#stafflastName').val(response.lName);
            $('#staffEmail').val(response.email);
            $("#staffEmail").attr("disabled", "disabled"); 

            $('#emailDiv').empty();
            var emailTag = '<p id="staffEmail">'+response.email+'</p>';
                      //  ' <p>Allowed domains are:<span id="domainName"></span></p> ';
            $('#emailDiv').append(emailTag);

        },
        error: function( error) {
            
        }             
    });
}

function validation(){
    
    var email = $('#staffEmail').val();
    var fName = $('#staffFirstName').val();
    // var lName = $('#stafflastName').val();

    if(  empty("First Name",fName) &&  validateEmail(email) ) {
        return true;

    } else return false;

}

function validateEmail(email){

    if(!empty("email", email)){
       
        return false;
    }
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(email)) {
 
        var i = email.indexOf("@");
        var substr = email.substr(i,email.length);
        var existDomain = $('#domainName').text();
        var arr = existDomain.split(',');

        for(var i=0;i<arr.length;i++){

            if(substr==arr[i]){
                return true;
            }else if(substr!=arr[i] && i==arr.length-1){
                $('#emailErrorMsg').show();
                $('#emailErrorMsg').text('This domain address does not belongs to us');
                return false;
            }
        }
    }else {
        $('#emailErrorMsg').show();
        $('#emailErrorMsg').text('Please provide a valid email address');
        return false;
    }
    return true;
}

// check for empty
function empty(field, data){
    var error = "";
   
    if (data === ''|| data === null || data === undefined) {
        error = "You didn't enter "+field+".";
        if(field=="email"){
            $('#emailErrorMsg').show();
            $('#emailErrorMsg').text(error);
        }else if(field=="First Name"){
            
            $('#fnameErrorMsg').show();
            $('#fnameErrorMsg').text(error);
        }
           
        
        return false;
    } 
    return true;
}

function hideErrEmail(){
    $('#emailErrorMsg').hide();
    $('#saveError').hide();
}

function fnameErrorHide(){
    $('#fnameErrorMsg').hide();
}

function saveErrorHide(){
    $('#saveError').hide();
}

