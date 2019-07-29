$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");

    getAllExhibitionByOrgId(token);

    $('#saveExhibition').click(function(){
        addExhibition(token);
    });
});

function addExhibition(token){

    var title = $('#title').val();
    var organization = $('#orgName').val(); 

    showLoader();
    $.ajax({
        url:  `${baseUrl}/api/exhibition/${title}/${organization}` ,
        type: "POST",
        crossDomain: true,
        data: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        'async': false,
        success: function (response) {
            console.log(response);
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

    var id = window.localStorage.getItem("ORGANIZATIONID");

    // showLoader();
    $.ajax({
        url:  `${baseUrl}/api/exhibition/org/${id}` ,
        type: "GET",
        crossDomain: true,
        data: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
            console.log(response);
            populateStaffData(response);
        },
        error: function( ) {
        }         
    });
}

function populateStaffData(response){
    console.log(response);
       
    //$('#staffData tbody').empty();
    var role;
    let tableRow = '<tr>'
                 + '<td>'+response.title+'</td>'
                 + '<td>'+response.venue+'</td>'
                 + '<td>'+response.date+'</td>'
                 + '<td>'+response.paintingSlots+'</td>'
                 + '</tr>';

    for(var i=0; i<response.length;i++){

        tableRow = '<tr>'
                    + '<td>'+response[i].title+'</td>'
                    + '<td>'+response[i].venue+'</td>'
                    + '<td>'+response[i].date+'</td>'
                    + '<td>'+response[i].paintingSlots+'</td>'
                    + '<td onclick="editExhibition([exhibitionId])" style="cursor: pointer;color:blue;">'+"Edit"+'</td>'
                    + '<td onclick="deleteExhibitionConfirmation([exhibitionIdVal])" style="cursor: pointer; color:blue;">'+"Delete"+'</td>'
                    + '</tr>';
        //var email = JSON.stringify(response[i].email);
       
        tableRow = tableRow.replace('[exhibitionId]',response[i].id);
        tableRow = tableRow.replace('[exhibitionIdVal]',response[i].id);
       
        $('#exhibitionData tbody').append(tableRow);
    }
    
}

