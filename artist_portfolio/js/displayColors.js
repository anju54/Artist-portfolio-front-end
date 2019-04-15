
//This is used to fetch all the colors
function getAllColors(token){

    $.ajax({
        url:  `${baseUrl}/api/color/all` ,
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
            populateColorsList(response);             
        },
        error: function( error) {
            console.log(error);
        }             
    });
}

//This is used for creating color dropdown list
function populateColorsList(response){

    for(var i=0; i<response.length;i++){
        var listRow = '<option value='+response[i].colorName+ '>' +response[i].colorName+'</option>';        
        $("#bgcol").append(listRow);
    }
}

var expanded = false;

function showCheckboxesForColrs() {
    var checkboxes = document.getElementById("checkboxesColors");
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
    var container = $("#checkboxesColors");
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        container.hide();
    }
});
