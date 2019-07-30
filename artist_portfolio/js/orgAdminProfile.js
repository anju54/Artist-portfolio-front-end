$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");
    getOrganizationByUserId(token);
    $("#update").click(function() {
        
        updateUserData(token);
    }); 
    
});

function getOrganizationByUserId(token){

    var userId = window.localStorage.getItem("USERID");
    console.log(userId);
    if(userId){
        $.ajax({

            url:  `${baseUrl}/api/orgStaff/user/${userId}/organization` ,
            type: "GET",
            crossDomain: true,
            data: {},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization','Bearer '+token);
            },
            'async': false,
            headers: {
                "Content-Type": "application/json",
            },
            success: function (response) {
                console.log(response);
                
                var organization = {
                    "id" : response.organizationId,
                    "name" : response.organizationName
                }
                organization = JSON.stringify(organization);
                window.localStorage.setItem("ORGANIZATION",organization);  
               
            },
            error: function(error) {

            },
            complete: function () {
                            
            }
        });
    }
    
}

function updateUserData(token){

    var id = window.localStorage.getItem("USERID");

    var fName = $('#firstName').val();
    var lName = $('#lastName').val();

    var data = {
        "fName":fName,
        "lName":lName
    };
    
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
        },
        complete: function () {
                        
        }
    });
}