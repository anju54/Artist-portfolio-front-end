//This is used to get all the painting type
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
           
        }             
    });
}

//this is used for populating painting type list
function populatePaintingTypeList(response){
    //var list =[];
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
