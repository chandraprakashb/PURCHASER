(() => {
    if(!('token' in localStorage)){
        //location.href('/login.html')
        window.location.href = 'login.html';
    }    
})();
