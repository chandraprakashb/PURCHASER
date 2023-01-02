function sendHttpRequest(url,data) { 
    var laoder = new Loader();
        laoder.showLoader();
    return new Promise(resolve=>{
        let reqData = data;
        reqData.delete('token');
        reqData.append('token',localStorage.getItem('token'));
        $.ajax({
            type: "POST",
            url: host+url,
            data: reqData,
            processData: false,
            contentType:false,
            timeout: 600000,
            success: function (response) {
                resolve(response);
                laoder.hideLoader();
                if(reqData.get('act') !== 'srch' && reqData.get('act') !== '' && reqData.get('act') !== 'getall'){
                    if(response.Result === 'OK'){
                        if(response.Msg){

                            Alert("success",'Success :)',response.Msg)
                        }
                    }else{
                        Alert("error",'Something Went Wrong !',response.Msg)
                    }
                }
            },
            error: function(response){
                resolve(response);
                laoder.hideLoader();
            }
        });
    })
}
