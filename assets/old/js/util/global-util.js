
const appLoader = document.getElementById('loader');

function  functionInitializer  (...funcions){
    $(document).ready(()=>{
        funcions.forEach(fn=>{
            fn();
        })
    })
}

function  elementAccessor  (...ids){
    let accessElements = {};
    ids.forEach(elId=>{
      let elementId = elId;
      accessElements[elementId.substring(1)] = document.querySelector(elId);
    })

    return accessElements;
};

function  pageLoader  (pageHash) {
    $("#app").empty();
    let loadUrl =`pages/${pageHash.substring(1)}.html`;
    $("#app").load(loadUrl);
}
 
function getOption(text,value) { 
    return `<option value="${value}">${text}</option>`;
}

function Toaster(type,infoTitle,info){

    let toaster = `
    <div id="toast-container" class="toast-top-right">
        <div class="toast toast-${type}" aria-live='polite'>
            <button type="button" class="toast-close-button" role='button'>X</button>
            <div class="toast-title">
                ${infoTitle}
            </div>
            <div class="toast-title">
                ${info}
            </div>
        </div>
    </div>`;

    $("body").append(toaster);
    $('.toast-close-button').click(()=>{
        $("#toast-container").remove();
    })
    setTimeout(()=>{
        $("#toast-container").remove();
    },3000)
}

function tabNavigation(nav = 'tab-navigation'){
  let navigation = "#"+nav+" button";
  let allNavs = Array.from($(navigation));
  let firtBtn = $(navigation)[0];

  firtBtn.disabled = true;
  
  allNavs.forEach((el)=>{
      if(el.dataset.link !== firtBtn.dataset.link){
          $("#"+el.dataset.link).hide();
      }
  })

  $(navigation).click(

      function(){
          let elements = $(this).siblings();
          $(this)[0].disabled = true;
         
          $("#"+$(this)[0].dataset.link).show();

          for(let el of elements){
              el.disabled =false;
              $("#"+el.dataset.link).hide();
          };
       
      }

  )

}

async function readFile(fileObj){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
          reader.readAsDataURL(fileObj);
            reader.onload = () => {
            resolve(reader.result);
          // need to run CD since file load runs outside of zone
          // this.cd.markForCheck();
        };
    });	
};

async function onSelectFile(event, formAttribute, isMultiple, maxSize, callBkfn){  		
    if (event.target.files && event.target.files.length) {
      const files = event.target.files;
      const uploadedFiles = [];
      
      for (let indx = 0; indx < files.length; indx++) {
        const fileObj = files[indx];
        
        if(maxSize && fileObj.size > maxSize) {
               alert('Image size is greater than allowed size.');
               return;  	        	
        }
        else if (fileObj.size > 1000000) {
          alert('Image size is greater than 1 MB');
          return;
      }
        // console.log(indx, uploadedFiles);
          uploadedFiles.push(await readFile(fileObj));
          if (isMultiple) {
          if (files.length - 1 === indx) {
              callBkfn(formAttribute, uploadedFiles);
             }
        } 
      else {	        	
          callBkfn(formAttribute, uploadedFiles);
        }     	        
      }      	      	
  }
}

function valueSetter(data){
    for(let elValue in data){
        $("."+elValue).val(data[elValue]);

    }
    
}

function containsWhitespace(str) {
    return /\s/.test(str);
}

function formDataToJson(formData){
    let formdata = {};
    for(key of formData.keys()){
        formdata[key] = formData.get(key);
    }

    return formdata;
}

function searchableSelect(config = {container:'',rawData:[],textAndId:['',''],infoFillers:['','']},clbkfn){
    var opts ='<option value="0">Please Select</option>';

    if(config.rawData){
        config.rawData.forEach((data)=>{
            opts +=getOption(data[config.textAndId[0]],data[config.textAndId[1]]);
        });
    }

    $(config.container).empty();
    $(config.container).html(`<select  style="width: 100%;">${opts}</select>`);
    $(config.container+" select").select2();
    $(config.container+" select").on('select2:select', (event)=> {
        var text = event.params.data.text;
        var id   = event.params.data.id;

        if(config.infoFillers[0]) $(config.infoFillers[0]).val(text === 'Please Select' ? '':text)
        if(config.infoFillers[1]) $(config.infoFillers[1]).val(id)
        if(clbkfn) clbkfn(event.params.data);
    });

}


const valResponse = (response)=>{
    if(response.Msg){
        if(response.Result=="SESS"){	        		
            Toaster('error','Session Expired !',response.Msg);
            sessionExipre()
            // localStorage.clear();
            // location.replace('login.html')
            return;
        }else if(response.Result === 'OK'){
            Toaster('success','',response.Msg)
        }else if(response.Result === 'NOK'){
            Toaster('error','Erro',response.Msg)
        }else{
            Toaster('error','',response.error)
        }
    }
}

function sendHttpRequest(url,data) { 
    return new Promise(resolve=>{
        appLoader.style.display = 'flex';
        let reqData = data;
        reqData.delete('token');
        reqData.append('token',localStorage.getItem('token'));
        $.ajax({
            type: "POST",
            url: host+url,
            data: reqData,
            processData: false,
            contentType:false,
            timeout: 600000,
            success: function (response) {
                if(reqData.get('act') !== 'getall' && reqData.get('act') !== 'getall'){
                    valResponse(response)
                }
                appLoader.style.display = 'none';
                resolve(response)
            },
            error: function(response){
                valResponse(response)
                resolve(response)
                appLoader.style.display = 'none';
            }
        });
    })
}

function sendMultipartRequest(url,data){
    return new Promise(resolve=>{
        appLoader.style.display = 'flex';
        let reqData = data;
        reqData.append('token',localStorage.getItem('token'));
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: host+url,
            data: reqData,
            processData: false,
            contentType:false,
            // cache: false,
            timeout: 600000,
            success: function (response) {
                valResponse(response)
                appLoader.style.display = 'none';
                resolve(response)
            },
            error: function(response){
                valResponse(response)
                resolve(response)
                appLoader.style.display = 'none';
            }
        });
    })
}

const formDataManager = (formel) => {

    let form = new FormData(formel);
        let formdata = {};
        for(let key of form.keys()){
        formdata[key] = form.get(key);
    }

    return formdata;
}

const addFormValidations = (formId,callbkFn) =>{
    let form = $("#"+formId);
    $(form).off( "submit" );

    $(form).submit(function(event){

    	if(form[0].checkValidity() === true) {
        	callbkFn();
    	}else{
            Toaster("error","Missing Fields","You Are Missing Some Required Fields !")
        }

    	event.preventDefault();
      	event.stopPropagation();
        form[0].classList.add('was-validated');

    });
}

function sessionExipre(){
    $(".app-container").hide();
    $(".session-expired").show();
}