// Clock
function Clock() { 

    this.start = () =>{
     
        this.renderTime();
        this.renderDate();
        // this.renderDay();
    }

    
    this.renderTime = () =>{
        var hourWrapper     = document.querySelectorAll('.hour');
        var minutsWrapper   = document.querySelectorAll('.minutes');
        var secWrapper      = document.querySelectorAll('.seconds');
        
        setInterval(()=>{
            var today = new Date();

            hourWrapper.forEach((hourwrapper)=>{
                hourwrapper.textContent     = this.manageSingleDigit(today.getHours());
            })

            minutsWrapper.forEach((minutswrapper)=>{
                minutswrapper.textContent     = this.manageSingleDigit(today.getMinutes());
            })

            secWrapper.forEach(secwrapper=>{
                secwrapper.textContent      = this.manageSingleDigit(today.getSeconds());
            })

        },1000)

    }

    this.renderDate = () =>{
        var dateWrapper = document.querySelectorAll('.date');
        var date = new Date(); 

        console.log(date.getFullYear());
        dateWrapper.forEach(datewrapper=>{
            datewrapper.textContent = this.manageSingleDigit(date.getDate())+"-"+this.manageSingleDigit(date.getMonth()+1)+"-"+date.getFullYear();
        })

    }

    this.renderDay = () =>{
        var daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var dayWrapper = document.querySelector('.day');
        var date = new Date(); 

        dayWrapper.textContent = daysOfWeek[date.getDay()]+","

    }

    // Utility Functions
    this.manageSingleDigit = (digit) =>{
        digit = digit.toString()
        var modyFiedDigit = digit.length === 1 ? "0" + digit : digit;
        return modyFiedDigit;
    }

}
var clock = new Clock();
clock.start()
// End Clock