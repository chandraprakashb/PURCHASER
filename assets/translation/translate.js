function SP_Translate(){
    this.langBtns = document.querySelectorAll('.lang-btns');

    this.mainSetup = () =>{
        this.manageButtonAction();
    }

    this.manageButtonAction = () =>{
        this.langBtns.forEach((langBtn)=>{
            langBtn.addEventListener('click',()=>{
                localStorage.setItem('currentLanguage',langBtn.dataset.lang);
                console.log(localStorage.getItem('currentLanguage'));
                this.translate()
            })
        }); 
    }

    this.translate = async () =>{
        let allTranslateKey = {};   
        var sp_translate = document.querySelectorAll('.sp-translate');

        await $.getJSON(`assets/translation/${localStorage.currentLanguage}/${localStorage.activePage}.json`, (json)=>{
            allTranslateKey = {...json};
        });
        console.log(allTranslateKey);
        await $.getJSON(`assets/translation/${localStorage.currentLanguage}/global.json`, (json)=>{
            allTranslateKey = {...allTranslateKey,...json};
        });

        console.log(allTranslateKey);
        sp_translate.forEach((translation)=>{
            console.log("Translating.........",translation);
            translation.textContent = allTranslateKey[translation.dataset.translateKey];
        });

    }

    this.mainSetup();
}   

var sp_translate = new SP_Translate();
