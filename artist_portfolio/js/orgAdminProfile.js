$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");
    $("#update").click(function() {
        
        updateUserData(token);
    }); 
    
 });

function updateUserData(token){

    var id = window.localStorage.getItem("USERID");

    var fName = $('#firstName').val();
    var lName = $('#lastName').val();

    var data = {
        "fName":fName,
        "lName":lName
    };
    console.log(data);
    data = JSON.stringify(data);

    $.ajax({

        url:  `${baseUrl}/api/artist/${id}` ,
        type: "PUT",
        crossDomain: true,
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization','Bearer '+token);
        },
        'async': false,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (response) {
         swal("data updated");
        },
        error: function(error) {
            console.log(error);
        },
        complete: function () {
                        
        }
    });
}