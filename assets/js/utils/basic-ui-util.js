
function FadeIn(...elements){
    elements.forEach(element => {
        $(element).fadeIn();
    });
}

function FadeOut(...elements){
    elements.forEach(element => {
        $(element).fadeOut();
    });
}

function containsWhitespace(str) {
    return /\s/.test(str);
}

function addFormValidations (formId,callbkFn){
    let form = document.querySelector("#"+formId);
    $(form).off( "submit" );

    $(form).submit(function(event){

    	if(form[0].checkValidity() === true) {
        	callbkFn();
    	}else{
            Alert("error","Missing Fields","You Are Missing Some Required Fields !")
        }

    	event.preventDefault();
      	event.stopPropagation();
        form[0].classList.add('was-validated');

    });
}

function formDataToJson(formData){
    let formdata = {};
    for(key of formData.keys()){
        formdata[key] = formData.get(key);
    }

    return formdata;
}

function getOptions(optionData,textKey,valueKey,defaultText,defaultValue){
    let options =  defaultText!== undefined && defaultValue !== undefined ? `<option value="${defaultValue}">${defaultText}</option>` : `<option value="">Please Select</option>`;

    optionData.forEach((data)=> options += `<option value="${data[valueKey]}">${data[textKey]}</option>`);

    return options;
}

// Utils
function formDataFiller (form,data,manageCheckCallback){
    var inputs = [...document.querySelectorAll(form + ' input'),...document.querySelectorAll(form + ' select'),...document.querySelectorAll(form + ' textarea')]

    document.querySelector(form).reset();
        for(let key in data){
            var input = inputs.find(input => input.dataset.key === key);
              if(input){
                input.value = data[key];
                if(input.type === 'checkbox' && manageCheckCallback !== undefined){
                  manageCheckCallback(input);
                }
              }
        }  
        
}

function renderTableRow(tableSelector,rowTemplate,tabledata,logicCallbk){

    var table       = document.querySelector(tableSelector);
    var tableBody   = table.tBodies[0];
    var rowTemplate = document.querySelector(rowTemplate);

    tableBody.innerHTML = '';

    tabledata.forEach(data => {
      var row = rowTemplate.content.cloneNode(true);
          row = row.querySelector('tr');

      var cells = row.querySelectorAll('td'); 

        tableBody.append(row);

        if(logicCallbk) logicCallbk(row,cells,data);
    });

}

/**
 * Config Properties And Methods
 * minOrMax: 'min' OR 'max'
 * numberOfCars:1 OR More
 * inputSelectore:input id or class
 * setMsgSelector:span or div where the message will shown 
 */

function characterSetter(config){
    this.minOrMax        = config.minOrMax;
    this.numberOfCars    = config.numberOfCars;   
    this.inputSelectore  = document.querySelector(config.inputSelectore);       
    this.setMsgSelector  = document.querySelector(config.setMsgSelector); 
    
    
    this.mainSetup  = () =>{
        this.inputSelectore.setAttribute('maxlength',this.numberOfCars)
        this.setMsgSelector.classList.add('maxmin-info')
        this.inputSelectore.addEventListener('click',this.manageChange);
        this.inputSelectore.addEventListener('mouseover',this.manageChange);
        this.inputSelectore.addEventListener('change',this.manageChange);
        this.inputSelectore.addEventListener('keypress',this.manageChange);
        this.inputSelectore.addEventListener('keyup',this.manageChange);
    }

   
   this.manageChange = () =>{

    if(this.inputSelectore.value.length === this.numberOfCars){
        // this.inputSelectore.disabled =true;
    }

    this.setMsgSelector.textContent = `${this.inputSelectore.value.length}/${this.numberOfCars}` ;
   }

   this.mainSetup()
}


async function pageLoad (pagename) {{
    localStorage.setItem('activePage',pagename);
    await $("#main").load(`pages/${pagename}.html`);
    sp_translate.translate();
}} 