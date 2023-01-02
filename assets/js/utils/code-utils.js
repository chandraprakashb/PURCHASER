function ElAppend(parentEl,...elements){
    this.parentEl = parentEl;
    this.element = elements;

    this.element.forEach((element)=> this.parentEl.append(element) );
}

// elementInfo = {};
// accessKey:'element Name'
function ElCreatore(elementsInfo){
    this.createdElements = {};
    this.elsInfo = elementsInfo;

    this.elementCreatore = () => {
        for(var elInfo in this.elsInfo) this.createdElements[elInfo] = document.createElement(this.elsInfo[elInfo])
    }
        
        
    

    this.elementCreatore();
    return this.createdElements;
}

// Tab Navigation
function TabNavigation(btnSection,clickElements='button',pageWrapper,pageClass) { 
    this.btnSection     = document.querySelector(btnSection);
    this.clickElements  = Array.from(this.btnSection.querySelectorAll(clickElements));
    this.pagesWrapper   = document.querySelector(pageWrapper);
    this.pages          = Array.from(this.pagesWrapper.querySelectorAll(pageClass))

    this.mainSetup = () =>{
        this.hideAllPages();
        this.manageActive();
        this.clickElements.forEach(el=>{
            el.addEventListener('click',()=>{
                var page = this.pages.find( page => page.dataset.page === el.dataset.page)
                this.hideAllPages();
                FadeIn(page)
            })
        })
    }

    this.manageActive = () =>{
        var activeBtn = this.clickElements.find(el=> el.dataset.active === 'true' );
        var activePage= this.pages.find(page=> page.dataset.page === activeBtn.dataset.page);
            this.hideAllPages();
            FadeIn(activePage);
    }

    this.hideAllPages = () => FadeOut(...this.pages) 

    this.mainSetup();
}