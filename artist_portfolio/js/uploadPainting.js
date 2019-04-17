$(document).ready(function() {

    var token = window.localStorage.getItem("TOKEN");
    
    $("#saveImage").click(function(event) {

        event.preventDefault();

        var form = $('#uploadimage')[0];
        var data = new FormData(form);
        uploadPaintings(token,data);

    }); 
    
 });
 
 //This is used for making ajax call for uploading painting
 function uploadPaintings(token,file){

    $('#imageUploadError').text('');
    showLoader();
    $.ajax({

        url:  `${baseUrl}/api/media/upload/paintings` ,
        type: "POST",
        enctype: "multipart/form-data",
        crossDomain: true,
        processData: false,  // it prevent jQuery form transforming the data into a query string
        contentType: false,
        data: file,
        async:false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        },
        success: function (response) {
           swal("painting uploaded successfully");
        },
        error: function(error) {    
            $('#imageUploadError').text(error.responseJSON.message)
        },
        complete: function () {
            counter =1;
            paintingList=[];
            showPaintings(token);
            hideLoader();
            bindEvent();
            $('#file').val('');
        }       
    });
    
 }