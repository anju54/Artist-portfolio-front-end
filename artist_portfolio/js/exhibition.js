var actionForExhibition = "save";
$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");

    var loggedInUser = window.localStorage.getItem("loggedInUser");
    loggedInUser = JSON.parse(loggedInUser);
    var fullName = loggedInUser.name;
    fullName = fullName.split(" ");
    $("#firstName").text(fullName[0]) ;

    var organization =JSON.parse(  window.localStorage.getItem("ORGANIZATION") );
    console.log(organization);
    $('#orgName').val(organization.name);

    var role = loggedInUser.role;

    // set ajax call and page element as per the role
    if(role=="ROLE_ORGSTAFF"){

        $('.adminNavBar').remove();

        $('#profileHref').attr("href","orgStaffProfile.html");

        var profileNavBar = '<li>'
                            +'  <a href="./orgStaffProfile.html">'
                            +'<i class="tim-icons icon-single-02"></i>'
                            +'<p>My Profile</p> </a>'
                            +' </li>';
        $('.nav').append(profileNavBar);

        var exhibitionNavBar = '<li>'
                            +'  <a href="./addExhibition.html">'
                            +'<i class="tim-icons icon-atom"></i>'
                            +'<p>Manage exhibition</p> </a>'
                            +' </li>';
        $('.nav').append(exhibitionNavBar);
        $('#assignStaffDiv').empty();
        populateListForArtist(token);

    }else{
        $('#profileHref').attr("href","orgAdminProfile.html");

        getAllStaffByorganization(token);

        if(actionForExhibition == "save"){
            getAllExhibitionByOrgId(token);
        }
        
        $('#saveExhibition').click(function(){
            addExhibition(token);
        });
    }
    
    if( getUrlParameter('id') ){
        getExhibitionByExhibitionId(token,id);
    }
});

// This is used to get all staff of organization
function getAllStaffByorganization(token){

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
            console.log(response);
            if(response!=null){
                
                populateStaffDataInCheckBoxFormate(response);
            }             
        },
        error: function( error) {
           
        }             
    });
}

function populateStaffDataInCheckBoxFormate(response){

    for(var i=0; i<response.length;i++){
        console.log(response[i].fName+" "+response[i].lName);
        var listRow = ' <label for="one">'
                  +'<input name="paintingList" type="checkbox" id="'+response[i].orgStaffId+"_staff"+ '"value="' +response[i].fName+" "+response[i].lName+ '" />' 
                  +response[i].fName+" "+response[i].lName+ '</label>';
        $("#checkboxes").append(listRow);
    }
}

function populateArtistDataAsCheckBoxFormate(response){

    for(var i=0; i<response.length;i++){
        
        var listRow = ' <label for="one">'
                  +'<input name="paintingList" type="checkbox" id="'+response[i].artistId+"_staff"+ '"value="' +response[i].fullName+ '" />' 
                  +response[i].fullName+ '</label>';
        $("#checkboxes").append(listRow);
    }
}

// This is used to update and save the exhibition 
function addExhibition(token){

    var id = getUrlParameter('id');
    var title         = $('#title').val();
    var organization  = $('#orgName').val(); 
    var dateVal          = $('#exhibitionDate').val(); 
    var venueVal         = $('#venue').val(); 
    var paintingSlotsVal = $('#paintSlots').val(); 

    var data = {
        "date":dateVal,
        "venue":venueVal,
        "paintingSlots":paintingSlotsVal
    };

    if( actionForExhibition == "save" ){

        urlvar = `${baseUrl}/api/exhibition/${title}/${organization}`;
        var typeVal = "POST";
    }else{

        urlvar =  `${baseUrl}/api/exhibition/${id}`;
        var typeVal = "PUT";
        data = JSON.stringify(data);
    }
   
    showLoader();
    $.ajax({
        url:   urlvar,
        type: typeVal,
        crossDomain: true,
        data: data,
        headers: {  "Content-Type": "application/json"},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        'async': false,
        success: function (response) {
            console.log(response);
            if(response.status=="success"){
                swal("your data has been updated!!");
            }else{
                $('#exhError').text("Error updating data..Try again!!");
            }
        },
        error: function(error) {
            hideLoader(); 
        },
        complete: function(error){
             hideLoader();
        }        
    });
}

// This is used to get all exhibition by organization
function getAllExhibitionByOrgId(token){

    var organization =JSON.parse(  window.localStorage.getItem("ORGANIZATION") );

    // showLoader();
    $.ajax({
        url:  `${baseUrl}/api/exhibition/org/${organization.id}` ,
        type: "GET",
        crossDomain: true,
        data: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
            console.log(response);
            if(response){
                populateExhibitionData(response);
            } 
        },
        error: function( ) {
        }         
    });
}

//This is for populating exhibition data into tabular format
function populateExhibitionData(response){
    
    $('#exhibitionData tbody').empty();
    let tableRow = '<tr>'
                 + '<td>'+response.title+'</td>'
                 + '<td>'+response.venue+'</td>'
                 + '<td>'+response.date+'</td>'
                 + '<td>'+response.paintingSlots+'</td>'
                 + '</tr>';

    for(var i=0; i<response.length;i++){

        if(!response[i].venue){
            response[i].venue = "";
        }
        if(!response[i].date){
            response[i].date = "";
        }
        tableRow = '<tr>'
                    + '<td>'+response[i].title+'</td>'
                    + '<td>'+response[i].venue+'</td>'
                    + '<td>'+response[i].date+'</td>'
                    + '<td>'+response[i].paintingSlots+'</td>'
                    + '<td><button type="button"  onclick="editExhibition([exhibitionId])"  class="btn btn-success btn-sm editDelBtn"><img src="https://img.icons8.com/material/10/000000/edit.png"></i></button>'
                    + '<button type="button"  onclick="deleteExhibitionConfirmation([exhibitionIdVal])" id="exhDelBtn" class="btn btn-success btn-sm editDelBtn"><img src="https://img.icons8.com/material/10/000000/delete-sign.png"></button>'     
                    + '</td>'
                    + '</tr>';
        tableRow = tableRow.replace('[exhibitionId]',response[i].id);
        tableRow = tableRow.replace('[exhibitionIdVal]',response[i].id);
       
        $('#exhibitionData tbody').append(tableRow);
    }   
}

function editExhibition(id){
    window.location.href = 'addExhibition.html?id='+id;
}

function deleteExhibitionConfirmation(id){

    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                
                deleteExhibition(id);
                // swal(" Your record has been deleted!", {
                //     icon: "success",
                // });
            } else {
                swal("Your data is safe!");
            }
        });
}

function deleteExhibition(id){

    var token = window.localStorage.getItem("TOKEN");
    $.ajax({
        url:  `${baseUrl}/api/exhibition/${id}` ,
        type: "DELETE",
        crossDomain: true,
        async : false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
             if(response){
                 swal("Deleted Successfully!!");
                 getAllExhibitionByOrgId(token);
             }else{
                 swal("Opps! error deleting data");
             }
        },
        error: function( ) {
        }         
    });
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

//This is used to get particular exhibition by exhibition id
function getExhibitionByExhibitionId(token,id){

    $.ajax({
        url:  `${baseUrl}/api/exhibition/${id}` ,
        type: "GET",
        crossDomain: true,
        async : false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
            console.log(response);
            if(response){
                var organization =JSON.parse(  window.localStorage.getItem("ORGANIZATION") );
                $('#orgName').val(organization.name);
                $('#title').val(response.title) ;
                $('#exhibitionDate').val(response.date); 
                $('#venue').val(response.venue); 
                $('#paintSlots').val(response.paintingSlots); 

                actionForExhibition = "update";
                console.log(actionForExhibition);
            } 
        },
        error: function( ) {
        }         
    });
}

function populateListForArtist(token){

    var artistListDiv = '<div class="col-md-3 pr-md-1">'
                            + '<label class="col-md-12" style="margin-top:20px">Send Invitation to Artist here</label>'
                        +'</div>'
                        +'<div class="col-md-6">'
                            +'<form>'
                                + '<div class="multiselect">'
                                    +' <div class="selectBox" onclick="showCheckboxes()">'
                                        +'<select class="form-control form-control-line">'
                                        +' <option id="optionPaintingType">Select an option</option>'
                                        +'</select>'
                            +' <div class="overSelect"></div>'
                                +'</div>'
                            +'<div id="checkboxes" style="max-height: 150px; overflow-y: auto">'
                            + '</div>'
                            +  '  </div>'
                        +' </form>'
                   +' </div>';
    $('#assignStaffDiv').append(artistListDiv);

    fetchArtistName(token);
}

function fetchArtistName(token){

    $.ajax({
        url:  `${baseUrl}/api/artist-profile/all` ,
        type: "GET",
        crossDomain: true,
        data: {},
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization','Bearer '+token);
        },
        headers: {
            "Content-Type": "application/json",
        },
        success: function (response) {
            populateArtistDataAsCheckBoxFormate(response); 
        },
        error: function( error) {
           
        }      
        

    });
}

function populateArtistDataAsCheckBoxFormate(response){

    for(var i=0; i<response.length;i++){
        
        var listRow = ' <label for="one">'
                  +'<input name="paintingList" type="checkbox" id="'+response[i].artistId+"_staff"+ '"value="' +response[i].fullName+ '" />' 
                  +response[i].fullName+ '</label>';
        $("#checkboxes").append(listRow);
    }
}



//************This is for populating checkbox */
var expanded = false;

function showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
    } else {
    checkboxes.style.display = "none";
    expanded = false;
    }
}   
$(document).mouseup(function(e) 
{
    var container = $("#checkboxes");
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        container.hide();
    }
});
//************ *******************************/