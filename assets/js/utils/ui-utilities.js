/**
 * UI Utilities
 * 1.Modal
 * 2.Confirmation
 * 3.Alert
 * 4.Cock
 * 5.Tel Input

/* Modal */
/**
Basic Modal = <div id="view-list-popup"><div><div class="header">heading<div class="hr"></div></div><div class="content-wrapper"><div class="table-wrapper"></div></div></div>div>
config:{};
    properties:
    selector:# or . or Tagname
    wrapperCss:"width:100%;background-color:red;"
    closeBtn:(false,default true),
    onclose:calback function
*/
function Modal(config) { 

    this.mainSetup = () =>{
        this.configration = config;
        this.modal = document.querySelector(this.configration.selector);
        this.modal.classList.add('app-modal');
        this.modal.style.display = 'none';

        this.basicSetup();
        this.manageModelElLocation();
        this.manageCloseModal();
    }

    this.basicSetup = () =>{
        this.modalWrapper = this.modal.querySelector('div');
        this.modalWrapper.classList.add('app-modal-wrapper');

        if(this.configration.boxShadow !== false) this.modalWrapper.classList.add('modal-wrapper-shadow')

        this.modalWrapper.setAttribute('style',this.configration.wrapperCss);

        $(this.modalWrapper).draggable()
    }

    // Setting Last In The Body Element
    this.manageModelElLocation = ( ) => document.body.append(this.modal);

    // Manage Close Modal
    this.manageCloseModal = () =>{
        this.closeBtns = this.modal.querySelectorAll('.close-popup');
        this.closeBtnMain = document.createElement('div');
        this.closeBtnMain.classList.add('main-close-btn');

        this.closeBtnMain.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';

        this.closeBtnMain.addEventListener('click',()=>{
            this.hideModal()
            if(this.configration.onclose)this.configration.onclose();
        });
        
        this.closeBtns.forEach(btn => {
            btn.addEventListener('click',()=>{
                this.hideModal();
                if(this.configration.onclose)this.configration.onclose();
            });
            
        });

        if(this.configration.closeBtnMain !== false) {
            this.modalWrapper.append(this.closeBtnMain);
        };
    }

    // Manage Show And Hide
    this.showModal = () => FadeIn(this.modal);
    this.hideModal = () => FadeOut(this.modal);

    this.mainSetup();
}

/**
 * Confirmation
 * configration = {};
 * headerText:Are Your Sure ? or it coud be any String
 * type:confirm or agree
 * msg:html or text
 * onCancel:calback function after cancel
 * onConfirm:calback function after confirm
 */
function Confirmation(configration = {headerText:"Header Text",type:'confirm'}){

    this.configration = configration;

    this.mainSetup = () => {    
        this.htmlCreation();
        this.buttonCreation();
        
        new ElAppend(document.body,this.htmlElements.mainWrapper)
        // console.log(.innerHTML)
    };

    this.htmlCreation = () =>{

        this.htmlElements   = new ElCreatore(
            {
                mainWrapper:"div",
                boxWrapper:"div",
                header:"div",
                headerText:"div",
                headerHr:'hr',
                contentWrapper:"div",
                msgWrapper:"div"
            }
        )

        this.htmlElements.mainWrapper.classList.add('confirmation-wrapper');
        this.htmlElements.boxWrapper.classList.add('confirmation');
        this.htmlElements.header.classList.add('header');
        this.htmlElements.contentWrapper.classList.add('content-wrapper');
        this.htmlElements.msgWrapper.className = 'msg-wrapper';

        if(this.configration.msg) this.htmlElements.msgWrapper.innerHTML = this.configration.msg;

        this.htmlElements.headerText.textContent = this.configration.headerText;

        new ElAppend(this.htmlElements.header,this.htmlElements.headerText,this.htmlElements.headerHr)
        new ElAppend(this.htmlElements.contentWrapper,this.htmlElements.msgWrapper);
        new ElAppend(this.htmlElements.boxWrapper, this.htmlElements.header,this.htmlElements.contentWrapper)
        new ElAppend(this.htmlElements.mainWrapper,this.htmlElements.boxWrapper);

        $(this.htmlElements.boxWrapper).draggable()
    }

    this.buttonCreation = () =>{
        this.btnSection   = document.createElement('div');
        this.sectionHr    = document.createElement('hr');
        this.cancelBtn    = document.createElement('button');
        this.okOrAgreeBtn = document.createElement('button');

        this.btnSection.className = 'btn-section';

        this.cancelBtn.textContent = "Cancel";
        this.cancelBtn.className = 'custome-btn-outline-primary';

        this.okOrAgreeBtn.className = 'custome-btn-primary';

        switch(this.configration.type){
            case 'confirm':
                this.okOrAgreeBtn.textContent = 'Okay';
                break;
            case 'agree':
                this.okOrAgreeBtn.textContent = 'I Agree';
              break;
            default:
                this.okOrAgreeBtn.textContent = 'Okay';

        }

        this.cancelBtn.addEventListener('click',()=> {
            this.manageClose();
            if(this.configration.onCancel)  this.configration.onCancel();
        })
        this.okOrAgreeBtn.addEventListener('click',()=> {
            this.manageClose();
            if(this.configration.onConfirm)  this.configration.onConfirm();
        })

        new ElAppend(this.btnSection,this.sectionHr,this.cancelBtn,"  ",this.okOrAgreeBtn);
        new ElAppend(this.htmlElements.contentWrapper,this.btnSection);
    }

    this.manageClose = () => this.htmlElements.mainWrapper.remove();

    this.mainSetup();
}


/**
 * Alert
 */

function Alert(type='error' ,heading="",msg=""){

    var type    = type ? type : "error";
    var heading = heading ? heading : "";
    var msg     = msg ? msg : "";

    var alertBox      = document.createElement('div');
    var alert         = document.createElement('div');
    var alertHeading  = document.createElement('div');
    var alertMessage  = document.createElement('div');

    alertBox.classList.add('alert-box');
    alert.classList.add('alert');
    alertHeading.classList.add('alert-heading');
    alertMessage.classList.add('alert-msg');

    alertHeading.textContent = heading;
    alertMessage.textContent = msg;
    
    switch(type){
        case "success":
            alertBox.classList.add('success-alert');
            break;
        case "error":
            alertBox.classList.add('danger-alert');
            break;
    }

    alertBox.append(alert);
    alert.append(alertHeading,alertMessage);
    console.log(alertBox);

    setTimeout(()=>document.body.append(alertBox),1000);

    setTimeout(()=>alertBox.remove(),4000);

}
// new Alert("error","Data Saved !","Data You Enter Have Been Saved Successfully!");


/**
 * Clock
 */
function Clock() { 

    this.start = () =>{
     
        this.renderTime();
        this.renderDate();
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


    this.manageDate = () =>{
       


    }

    this.renderDate = () =>{

        this.months= ["January","February","March","April","May","June","July","August","September","October","November","December"];
        this.date = new Date(); 

        this.dateWrappers  = document.querySelectorAll('.date');
        this.monthWrappers = document.querySelectorAll('.month');
        this.yearWrappers   = document.querySelectorAll('.year');

        this.dateWrappers.forEach(datewrapper=> datewrapper.textContent = this.manageSingleDigit(this.date.getDate()));
        this.monthWrappers.forEach(month=>{ month.textContent = this.months[this.date.getMonth()]});
        this.yearWrappers.forEach(year=>{
            year.textContent = this.date.getFullYear()
        })
        // var dateWrapper = document.querySelectorAll('.date');

        // console.log(date.getFullYear());
        // dateWrapper.forEach(datewrapper=>{
        //     datewrapper.textContent = this.manageSingleDigit(date.getDate())+"-"+this.manageSingleDigit(date.getMonth()+1)+"-"+date.getFullYear();
        // })
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


// TelInpu
function telInput(input){
    var input = document.querySelector(input)
        ipt = window.intlTelInput(input, {utilsScript: "./assets/js/libs/intltelinput/utils.js",});
}


function Loader(){
    
    this.createLoader = () =>{
        this.laoderEl = document.createElement('div');

        this.laoderEl.classList.add('app-loader');

        this.laoderEl.innerHTML = `<img src="https://web-cart.com/webcart-multi-vendor-2/img/loader.gif">`;

        document.body.append(this.laoderEl);
    }

    this.showLoader = () => //this.createLoader();
    

    this.hideLoader = () => {
    //    if(this.laoderEl)this.laoderEl.remove()
    };

}

