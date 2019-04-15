function validate(){
    
    var password = $('#password').val();
    var emailVal = $('#email').val();
   
    if( validateEmail(emailVal) && validatePassword(password)) {
        return true;

    } else return false;
}

// check for password
function validatePassword(password) {
    
    var error = "";
    if(!isEmpty("Password", password)){
        return false;
    }
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(password.match(passw)) { 
        $('#passwordError').hide();
        return true;
    } else{ 
        $('#passwordError').show();
        var error = 'Wrong password ...!  it should contain 6 to 20 characters which contain '+
        'at least one numeric digit, one uppercase and one lowercase letter';
        $('#passwordError').text(error);
        return false;
    }
}

// chek for email
function validateEmail(emailVal){

    if(!isEmpty("email", emailVal)){
        return false;
    }
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (!reg.test(emailVal)) {
        $('#emailError').show();
        $('#emailError').text("please provide valid email address");
        return false;
    }
    return true;
}

// check for empty
function isEmpty(field, data){
    var error = "";
    if (data === ''|| data === null || data === undefined) {
        error = "You didn't enter "+field+".";
        if(field=="email"){
            $('#emailError').text(error);
        }else if(field=="Password"){
            $('#passwordError').text(error);
        }
        return false;
    } 
    return true;
}
