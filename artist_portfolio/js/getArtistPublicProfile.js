$(document).ready(function() {

    var id = getUrlParameter('id');
    getPublicProfilePic(id);
    getArtistProfileInfo(id);  
     
});

//This is used to fetch artist profile basic information
function getArtistProfileInfo(id){

    $.ajax({
        url:  `${baseUrl}/api/artist-profile/info/?id=${id}` ,
        type: "GET",
        crossDomain: true,
        data: {},
        // beforeSend: function (xhr) {
        //     xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        // },
        headers: {
            "Content-Type": "application/json",
        },
        success: function (response) {
            console.log(response);
            setData(response);    
        },
        error: function( ) {
        }         
    });

}

//This is used to set the artist basic information to artist profile page
function setData(response){

    $("#fullName").text(response.fname+" "+response.lname) ;
    $("#name").text(response.fname+" "+response.lname) ;
    $("#email").text(response.email) ;
    $("#aboutMe").text(response.aboutMe) ;
    
    $('#linkedin').attr("href",response.linkedinUrl);
    $('#facebook').attr("href",response.facebookUrl) ;   
    $('#twitter').attr("href",response.twitterUrl) ;

    var color = response.colorName;
    $('#mainColorDiv').css({backgroundColor: color});
    $('#fh5co-work').css({backgroundColor: color});

    for(var i=0; i<response.paintingType.length;i++){

        var listrow = '<h3 class="card-subtitle" id="paintingType">'+ response.paintingType[i].paintingName+'</h6>'
        $('#paintingType').append(listrow);
    }
}

// This method is used to get profile pic
function getPublicProfilePic(id){

    $.ajax({
        url:  `${baseUrl}/api/artist-profile/public/profile-pic/?id=${id}` ,
        type: "GET",
        crossDomain: true,
        data: {},
        headers: {
            "Content-Type": "application/json",
        },
        success: function (response) {
            console.log(response); 
            var path = baseUrl + response.path + response.fileName ;
            $('#profilePic').attr("src",path);
            console.log(path);  
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