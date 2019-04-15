// $(document).ready(function() {

//     var token = getCookie('TOKEN')
//     var email = getUrlParameter('email');
//     var profileName = getUrlParameter('profileName');
//     getProfileDetail(token,userId,profileName);

 
//  });

//  function getProfileDetail(token,userId,profileName){

//     $.ajax({
//         url:  `${baseUrl}/api/artist-profile/${email}/info/${profileName}` ,
//         type: "GET",
//         crossDomain: true,
//         data: {},
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader('Authorization', 'Bearer '+ token);
//         },
//         success: function (response) {
//             console.log(response);
//             //processData(response);    
//         },
//         error: function( ) {
//         }         
//     });
//  }

// function processData(response){
//     $("#name").text(" "+fullName) ;
//     $("#twitter").text(" "+response.twitterUrl) ;
//     $("#facebook").text(" "+response.facebookUrl) ;
//     $("#linkedIn").text(" "+response.linkedInUrl) ;

// }


// var getUrlParameter = function getUrlParameter(sParam) {
//     var sPageURL = window.location.search.substring(1),
//         sURLVariables = sPageURL.split('&'),sParameterName,i;

//     for (i = 0; i < sURLVariables.length; i++) {
//         sParameterName = sURLVariables[i].split('=');
//         if (sParameterName[0] === sParam) {
//             return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
//         }
//     }
// };

// function getCookie(name) {
//     var dc = document.cookie;
//     var prefix = name + "=";
//     var begin = dc.indexOf("; " + prefix);
//     if (begin == -1) {
//         begin = dc.indexOf(prefix);
//         if (begin != 0) return null;
//     }
//     else
//     {
//         begin += 2;
//         var end = document.cookie.indexOf(";", begin);
//         if (end == -1) {
//         end = dc.length;
//         }
//     }
//     return decodeURI(dc.substring(begin + prefix.length, end));
// } 