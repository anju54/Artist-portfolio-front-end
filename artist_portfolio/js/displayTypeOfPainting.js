// $(document).ready(function() {

//     var token = window.localStorage.getItem("TOKEN");
//     getAllPaintingType(token);     
// });

function getAllPaintingType(token){

    $.ajax({
        url:  `${baseUrl}/api/painting-type/all` ,
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
            populatePaintingTypeList(response);             
        },
        error: function( error) {
            console.log(error);
        }             
    });
}

function populatePaintingTypeList(response){
    
    for(var i=0; i<response.length;i++){
        var listRow = ' <label for="one">'+
                  '<input name="paintingList" type="checkbox" id="'+response[i].id+"_paintingType"+ '"value="' +response[i].paintingName+ '" />' 
                  +response[i].paintingName+ '</label>';
        $("#checkboxes").append(listRow);
    }
}

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
