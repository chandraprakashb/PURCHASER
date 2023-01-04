
// function Modal(config){

//     this.renderModal = () =>{
//         this.config = config; 
//         this.selectore   = document.querySelector(this.config.modalSelector);
//         this.mainWrapper = this.selectore.querySelector('div'); 
//         this.closeBtn  = this.selectore.querySelector('.close-popup');

//         this.basicSetup();
//         this.closeBtn.addEventListener('click',()=>{
//             this.hideModal();
//         });
//     }   

//     this.basicSetup = () =>{
//         this.selectore.classList.add('utility-modal');
//         this.mainWrapper.classList.add('utility-modal-wrapper');

//         if(this.config.closeSidebar) closeSidebar();

//         if(this.config.useDefaultStyle){
//             this.mainWrapper.classList.add('utility-modal-wrapper__default');
//         }else{
//             this.mainWrapper.style.width = this.config.width;
//             this.mainWrapper.style.height = this.config.height;
//         }

//         this.hideModal();
//         this.manageNotificationPannel()
//     }

//     this.hideModal = () =>{
//         this.selectore.style.display = 'none';
//         fadeIn(this.notificationPannel)
//     }

//     this.showModal = () =>{
//         this.selectore.style.display = 'block';
//         fadeOut(this.notificationPannel)
//     }

//     this.manageNotificationPannel = () =>{
//         this.notificationPannel =  document.querySelector('.notification-pannel');
//     }

//     this.renderModal();
// }

function Confirmation(config){

    console.log(config);
    // Creating Html
    this.createHtml = async ()=>{
        this.modalId = this.generateRandomId(20);
        this.confirmationPopup = document.createElement('div');
        this.modalEl = `
                <div id="${this.modalId}">
                    <div class="modal-wrapper">
                        <div class="text-right"><button class="btn btn-danger close-popup">Close</button></div>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam rem amet doloribus maiores tempora repellendus praesentium suscipit dolorum recusandae, impedit accusantium fuga aspernatur asperiores cupiditate? Quibusdam possimus a maxime nobis.
                        </p>
                        <hr>
                        <p>
                            <button class="btn btn-primary ok-btn">Confirmed</button>
                            <button class="btn btn-danger cancel-btn">Cancel</button>
                        </p>
                    </div>
                </div>`;
        this.confirmationPopup.innerHTML = this.modalEl;

        await this.injectConfirmation();

        this.popup = new Modal({
            modalSelector: "#"+this.modalId,
            useDefaultStyle:false,
            width:"40%",
        })

        // this.popup.showModal();
    }
    // Appending To The Body
    this.injectConfirmation = () =>{
        return new Promise(resolve=>{
            document.body.append(this.confirmationPopup);
            resolve(this.confirmationPopup)
        })
    }
    // Generating Random Id 
    this.generateRandomId = (length) =>{
        // declare all characters
        var characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var result = '';
        var charactersLength = characters.length;

        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

       return result;
    }

    this.takeConfirmation = () =>{
        return new Promise(resolve=>{
            var okBtn       = document.querySelector('.ok-btn');
            var calcelBtn   = document.querySelector('.cancel-btn');

            this.popup.showModal();
            okBtn.addEventListener('click',()=>{
                resolve(true)
            })
            calcelBtn.addEventListener('click',()=>{
                resolve(false)
            })
            
        });
    }

    this.createHtml();
    // this.createHtml().then(()=>{
    //     this.popup.showModal();
    // });
}