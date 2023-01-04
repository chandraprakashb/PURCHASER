var formChecks = document.querySelectorAll('.form-check-input');

var forgotUsernameForm = document.getElementById('forgot-username-form');

var passwordOptpForm  = document.getElementById('password-otp-form')  ;
var changePasswordForm= document.getElementById('change-password-form');
var showPassword = document.querySelector('.show-pwd');

var userType = document.getElementById('user-type');

console.log(passwordOptpForm,changePasswordForm);

// fadeOut(changePasswordForm)
fieldHandler('P')
fadeOut(changePasswordForm)
addFormValidations('password-otp-form',requestPasswordOtp);
addFormValidations('change-password-form',changePassword);
addFormValidations('forgot-username-form',changeUserName);

showPassword.addEventListener('click',(event)=>{
    console.log(event.target);
})

formChecks.forEach(check=>{
    check.addEventListener('change',event=>fieldHandler(event.target.value))
})

function sendRequest(reqData){
    return new Promise(resolve=>{
        $.ajax({
            type: "POST",
            url: 'http://78.47.157.146:8080/usermanage/api/frgtUnmPwd',
            data: reqData,
            processData: false,
            contentType:false,
            timeout: 600000,
            success: function (response) {  
                valResponse(response)      
                resolve(response)
            },
            error: function(response){
                valResponse(response)      
                resolve(response)
            }
        });
    })
}

function fieldHandler(usertype = 'P'){
    var purchaserInputs  = document.querySelectorAll('.puchaser');
    var officialInputs   = document.querySelectorAll('.official');


    userType.value = usertype;

    switch(usertype){
        case 'P':
            purchaserInputs.forEach(input=>{
                input.querySelector('input').disabled = false;
                input.style.display='block'
            })
            officialInputs.forEach(input=>{
                input.querySelector('input').disabled = true;
                input.style.display='none'
            })
        break;
        case 'O':
            purchaserInputs.forEach(input=>{
                input.querySelector('input').disabled = true;
                input.style.display='none'
            })
            officialInputs.forEach(input=>{
                input.querySelector('input').disabled = false;
                input.style.display='block'
            })
            
            
        break;
    }
}

async function changeUserName(){
    var usrRequest = new FormData(forgotUsernameForm)
        usrRequest.append('ACT','unm');
        usrRequest.append('typ',userType.value);
    sendRequest(usrRequest)
}

async function requestPasswordOtp(){
    var passRequest = new FormData(passwordOptpForm);
        passRequest.append('ACT','pwd');
        passRequest.append('typ',userType.value);

    var otpResponse = await sendRequest(passRequest);
        if(otpResponse.Result === 'OK' && otpResponse.Msg === 'OTP Sent'){
            fadeIn(changePasswordForm);
            fadeOut(passwordOptpForm)
        }
}

async function changePassword(){
    var passRequest = new FormData(changePasswordForm);
        passRequest.append('ACT','chngpwd');
        passRequest.append('typ',userType.value);
        passRequest.append('usr.login',document.getElementById('usr_login').value)

    sendRequest(passRequest)
}