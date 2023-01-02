function ManageIndexHtml () {

    this.mainSetup = () =>{
        this.manageUserInfo();
        this.manageLogout();
        this.manageHelp();
        this.loadUserLinks();
        this.manageDefaulterStatus();
        this.pageLoad('auctionapproved');
        // this.pageLoad('usermnage');
        
    } 

    // Manage Render UserInfo 
    this.manageUserInfo = () =>{
      this.userName = document.querySelector('.userName');
      this.commodityName = document.querySelector('.commodity-name');
      this.userName.textContent = localStorage.getItem('usr.nm');
      this.commodityName.textContent = localStorage.getItem('comodityName');
    }
    // End Render User Info


    // Manage Render User Links
    this.loadUserLinks = async () =>{
        let screenData = await sendHttpRequest('eaucnmanage/getapps',new FormData());
        this.renderLinks(screenData.Record);
        // this.renderLinks(
        //     [
        //         {
        //             text:"Dashboard",
        //             value:"dashboard",
        //             icon:"gauge"
        //         },
        //         {
        //             text:"Office",
        //             value:"office",
        //             icon:"building-circle-check"
        //         },
        //         {
        //             text:"Designation",
        //             value:"designation",
        //             icon:"person-walking-luggage"
        //         },
        //         {
        //             text:"Setting",
        //             value:"setting",
        //             icon:"gear"
        //         },
        //         {
        //             text:"Profile",
        //             value:"profile",
        //             icon:"id-badge"
        //         },
        //         {
        //             text:"Users",
        //             value:"usermnage",
        //             icon:"users"
        //         },
        //         {
        //             text:"Lot Entry",
        //             value:"lotentry",
        //             icon:"file-lines"
        //         },
        //         {
        //             text:"Lot Finalize",
        //             value:"lotfinalize",
        //             icon:"check-to-slot"
        //         },
        //         {
        //             text:"Bidder",
        //             value:"bidder",
        //             icon:"user-tie"
        //         },
        //         {
        //             text:"Create Auction",
        //             value:"createauction",
        //             icon:"pen-to-square"
        //         },
        //         {
        //             text:"Auction Approve",
        //             value:"auctionapproved",
        //             icon:"thumbs-up"
        //         },
        //         {
        //             text:"Upload Upset",
        //             value:"uploadupset",
        //             icon:"arrow-up-from-bracket"
        //         },
        //         {
        //             text:"Material Dispatch",
        //             value:"dispatch",
        //             icon:"truck-fast"
        //         },
        //         {
        //             text:"Notice",
        //             value:"notice",
        //             icon:"circle-exclamation"
        //         },
        
        //         {
        //             text:"Order/Reciept",
        //             value:"order",
        //             icon:"arrow-down-short-wide"
        //         },
         
        //         {
        //             text:"Running Auction",
        //             value:"runningauction",
        //             icon:"chart-line"
        //         },
                
        //         {
        //             text:"Auction Plan",
        //             value:"auctionplan",
        //             icon:"tree"
        //         }
        // ]
        // )
    }

    this.renderLinks = (linkData) =>{
        console.log(linkData);
        this.leftSidelinkWrapper = document.querySelector('.aside1');
        this.rightSidelinkWrapper = document.querySelector('.aside2');
        this.leftLinks=[]; 
        this.rightLinks = [];
        if(linkData){
            linkData.forEach(data=>{
                var linkEls = new ElCreatore({
                    linkDiv:"div",
                    textWrapper:"div",
                    iconWrapper:"div"
                });

                linkEls.linkDiv.classList.add('link');
                linkEls.linkDiv.dataset.link = data.value;

                linkEls.linkDiv.addEventListener('click',this.pageLoad.bind('',data.value))

                linkEls.textWrapper.classList.add('text');
                linkEls.iconWrapper.classList.add('icon');


                linkEls.textWrapper.textContent = data.text;
                linkEls.iconWrapper.innerHTML = `<i class="fa-solid fa-${data.icon}"></i>`;

                ElAppend(linkEls.linkDiv,linkEls.textWrapper,linkEls.iconWrapper);

                if(this.leftLinks.length !== 12) this.leftLinks.push(linkEls.linkDiv);
                else  this.rightLinks.push(linkEls.linkDiv)
                
                // ElAppend(this.leftSidelinkWrapper,linkEls.linkDiv)
            })
        }

        if(this.leftLinks.length){
            this.leftLinks.forEach((link) => this.leftSidelinkWrapper.append(link));
            if(this.rightLinks.length)
            this.rightLinks.forEach((link) => this.rightSidelinkWrapper.append(link));
        }

        
        

        console.log("this.leftLinks",this.leftLinks);
        console.log("this.rightLinks",this.rightLinks);
        
    }
    // End Manage Render User Link

    this.manageLogout  = () =>{
        this.logOutBtn = document.querySelector('.logout-btn');
        this.logOutBtn.addEventListener('click',()=>{
            localStorage.clear();
            window.location.reload()
        });
    }

    this.manageHelp = () =>{
        this.helpBtn = document.querySelector('.help-btn');
        this.helpModal   = new Modal({
            selector:'#help',
            wrapperCss:"width:30%;border-radius:5px;margin-top:150px",
        });

        this.helpBtn.addEventListener('click',this.helpModal.showModal)
    }

    this.pageLoad = (pagename) => $("#main").load(`pages/${pagename}.html`);
    

    this.manageDefaulterStatus = () =>{
        this.listModal = new Modal({
            selector:"#view-list-popup",
            wrapperCss:"width:50%;backcolor:red;",
        })
        this.viewListBtn = document.querySelector('.view-list');

        this.viewListBtn.addEventListener('click',()=>this.listModal.showModal());
    }

    this.mainSetup();
}

var manageIndexHtml = new ManageIndexHtml();