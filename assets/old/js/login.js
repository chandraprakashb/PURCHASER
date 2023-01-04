
    addFormValidations('login-form',loginRequest);

    function loginRequest(){
        let formData = new FormData($("#login-form")[0]);
        $.ajax({
            type: "POST",
            url: host+'login',
            data: formData,
            processData: false,
            contentType: false,
            cache: false,
            timeout:600000,
            success: function (response) {
               console.log(response);
    
                if(response.Result === 'OK'){

                    Toaster("success","Redirecting.....",'Successfully Logged In.')
                    localStorage.setItem('role',response.Record['usr.role']);
                    localStorage.setItem('userName',response.Record['usr.nm']);
                    localStorage.setItem('token',response['token']);
                    console.log(response);

                    if(response.Record['usr.role'] === "STAD"){
                        location.replace('comodities.html');
                    }else{
                        location.replace('index.html');
                    }

                }
    
                if(response.Result === 'NOK'){
                    Toaster("error","Faild :(",response.Msg)
                }
               
            },
            error: function(response){
    
            }
        });
    }