(() => {
    if(!('token' in localStorage)){
        window.location.href = 'login.html';
    }    
    if(!('token' in localStorage)){
        //location.href('/login.html')

    }  
})();
