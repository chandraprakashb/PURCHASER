functionInitializer(
    ()=>{
        if(localStorage.length !== 0){
            $("#app").empty();
            $("#app").load(`pages/ewalletaccount.html`);
        }
    },
    renederScreens,
    renderUserInfo
);

const navEls = elementAccessor(
    '#sideNav',
);

async function renederScreens(){
    navEls.sideNav.innerHTML = '';
    let screenData = await sendHttpRequest('getapps',new FormData());
    let screens = [...screenData.Record];
    // let menuHeading = document.createElement('li');
    //     menuHeading.className = 'app-sidebar__heading';
    //     menuHeading.textContent = 'Client Management';
    //     navEls.sideNav.append(menuHeading);

        console.log(screens);

        screens.forEach(navItem => {
            let list = document.createElement('li');

            let anchor = document.createElement('a');
                anchor.href = `#${navItem.value}`;

                
                let linkIcon = document.createElement('i');
                linkIcon.className = "metismenu-icon pe-7s-"+navItem.icon;
                
                
                anchor.append(linkIcon)
                anchor.append(navItem.text)
                list.append(anchor)
                navEls.sideNav.append(list);
                
                if(navItem.value === "dashboard"){
                    anchor.classList.add('mm-active');
                    list.classList.add('dashboard');
                    list.style.color = '#fff !important';

                    navEls.sideNav.insertAdjacentElement('afterbegin',list);
                }
        });

    
    navEls.sideNav.addEventListener('click',event=>{
        navEls.sideNav.querySelectorAll('a').forEach(a=>{
            a.classList.remove('mm-active')
        })
        pageLoader(event.target.closest('a').hash);
        event.target.closest('a').classList.add('mm-active')
        
    });


}
 
function renderUserInfo (){
    document.getElementById('userName').textContent = localStorage.getItem("userName");
    // document.getElementById('userRole').textContent = localStorage.getItem("role");
}

async function logOut(){
   const logout =  new FormData();
   logout.append('act','logout')
   localStorage.clear();
   location.reload()
   await sendHttpRequest('logout',logout);
}

function ManageBlockList() {
    this.mainSetup = () =>{
        this.modal      = document.querySelector('.block-list-modal');
        var viewListBtn = document.querySelector('.view-list');
        var closeBtn    =  this.modal.querySelector('.close-btn');
        fadeOut(this.modal)
        closeBtn.addEventListener('click',()=>{
            fadeOut(this.modal)
        })

        viewListBtn.addEventListener('click',this.showList)
        
        console.log(this.modal);
    }

    this.showList = () =>{
        fadeIn(this.modal)
    }
}

var blockList = new ManageBlockList();
    blockList.mainSetup();