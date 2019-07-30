var actionForExhibition = "save";
$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");

    getAllExhibitionByOrgId(token);

    getExhibitionByExhibitionId(token);

    $('#saveExhibition').click(function(){
        addExhibition(token);
    });
});

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
            console.log("here");
            console.log(response);
            populateExhibitionData(response);
        },
        error: function( ) {
        }         
    });
}

function populateExhibitionData(response){
    
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
                    + '<td><button type="button"  onclick="editExhibition([exhibitionId])"  class="btn btn-success btn-sm editDelBtn"><img src="https://img.icons8.com/material/10/000000/edit.png"></i></button>'
                    + '<button type="button"  onclick="deleteExhibitionConfirmation([exhibitionIdVal])" class="btn btn-success btn-sm editDelBtn"><img src="https://img.icons8.com/material/10/000000/delete-sign.png"></button>'     
                    + '</td>'
                    // + '<td onclick="editExhibition([exhibitionId])" style="cursor: pointer;color:blue;">'+"Edit"+'</td>'
                    // + '<td onclick="deleteExhibitionConfirmation([exhibitionIdVal])" style="cursor: pointer; color:blue;">'+"Delete"+'</td>'
                    + '</tr>';
        tableRow = tableRow.replace('[exhibitionId]',response[i].id);
        tableRow = tableRow.replace('[exhibitionIdVal]',response[i].id);
       
        $('#exhibitionData tbody').append(tableRow);
    }   
}

function editExhibition(id){
    window.location.href = 'addExhibition.html?id='+id;
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


function getExhibitionByExhibitionId(token){

    var id = getUrlParameter('id');

    $.ajax({
        url:  `${baseUrl}/api/exhibition/${id}` ,
        type: "GET",
        crossDomain: true,
        async : false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
            if(response){
                var organization =JSON.parse(  window.localStorage.getItem("ORGANIZATION") );
                $('#orgName').val(organization.name);
                $('#title').val(response.title) ;
                $('#date').val(response.date); 
                $('#venue').val(response.venue); 
                $('#paintingSlots').val(response.paintingSlots); 

                actionForExhibition = "update";
                console.log(actionForExhibition);
            } 
        },
        error: function( ) {
        }         
    });
}
