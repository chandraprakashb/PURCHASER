var landingPage   = document.getElementById('landing-page');
var regTypeWrapper= landingPage.querySelector(".regtype-wrapper");
var regType       = landingPage.querySelector('#reg-type');
var check_TC      = landingPage.querySelector('#terms-check'); 
var procceedBtn   = landingPage.querySelector('#procceed-btn'); 


var stepsWrapper  = document.getElementById('setup-wrapper');
var stepWrappers  = stepsWrapper.querySelectorAll('.step-wrapper');
var fielLoader_PI = stepsWrapper.querySelector('#pesonal-info #field-loader');
var fielLoader_AC = stepsWrapper.querySelector('#account-gstin #field-loader');
var fielLoader_DU = stepsWrapper.querySelector('#document-info #field-loader');

var regForm = document.getElementById('registeration-form')



// Field Templates
var pi_individual = document.getElementById('personal-info-individual');
var pi_firm       = document.getElementById('personal-info-firm');
var ac_individual = document.getElementById('account-gstin-individual');
var ac_firm       = document.getElementById('account-gstin-firm');
var du_individual = document.getElementById('document-upload-individual');
var du_firm       = document.getElementById('document-upload-firm');


var regRawData = [];


functionInitializer(()=>{
    setupWizard()
    fadeOut(regTypeWrapper,stepsWrapper);

    addFormValidations('registeration-form',registeration)
    

    // testMode()
    $.getJSON('./json/registeration.json',(json)=>{
      regRawData = json;
      console.log(regRawData);
    })
})

function sendReq(url,data) { 
    appLoader.style.display = 'flex';
    return new Promise(resolve=>{
        let reqData = data;
        $.ajax({
            type: "POST",
            url: "http://devservr.sparsht.com:8080/usermanage/api/register",
            data: reqData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType:false,
            timeout: 600000,
            success: function (response) {
                valResponse(response)
                resolve(response)
                appLoader.style.display = 'none'
            },
            error: function(response){
                valResponse(response)
                resolve(response)
            }
        });
    })
}

/**Step Wizard */
  function setupWizard(){
      var idx = 0 ;
      function setClasses(index, steps) {
        idx = index;
          stepChanger(stepWrappers[index]);
          if (index < 0 || index > steps) return;
          if(index == 0) {
            if($("#prev").text() === 'Back'){
              return;
            }
            $("#prev").text('Back');
          } 
          if(index == steps) {
            $("#next").text('Submit');
          } else {
            $("#next").text('Next');
          }

          $("ul li").each(function() {
            $(this).removeClass();
          });

          $("ul li:lt(" + index + ")").each(function() {
            $(this).addClass("done");
          });

          $("ul li:eq(" + index + ")").addClass("active")

          var p = index * (100 / steps);
          $("#prog").width(p + '%');
        }
        
        $("#prev").click(function(){
            if($("#prev").text() === 'Back'){
              fadeOut(stepsWrapper)
              fadeIn(landingPage)
              return;
            }
            var step = $(".step-wizard ul li.active div.step")[0].innerText;
            var steps = $(".step-wizard ul li").length;    
            setClasses(step - 2, steps - 1);
          
        });

        $("#next").click(function(){
          if ($(this).text() == 'Submit') {
            $("#submit")[0].click()
          } else {
            
            
            if($("#prev").text() === 'Back'){
              $("#prev").text('Previus');
            }
            var step = $(".step-wizard ul li.active div.step")[0].innerText;
            var steps = $(".step-wizard ul li").length;    
            setClasses(step, steps - 1);  

          }
        });
        
        // initial state setup
        setClasses(0, $(".step-wizard ul li").length);
        stepChanger(stepWrappers[0]);
  }
      
  function stepChanger(stepname){
    stepWrappers.forEach(wrapper=> wrapper.style.display ='none' );
    fadeIn(stepname)
  }

  function resetWizard(){

    document.querySelectorAll(".step-wizard ul li").forEach(li=> li.className = '' );
    document.querySelector(".step-wizard ul li").className = 'active';
    stepsWrapper.querySelectorAll("input").forEach(input=> input.value = '');
    stepsWrapper.querySelectorAll("select").forEach(input=> input.value = '');

    $("#next").text("Next");

    setupWizard()
  }

  function documentValidatore() {
    var validate = true;
    var docWrapper = stepsWrapper.querySelector('#document-info');
    // Text Inputs
    var gstInput = stepsWrapper.querySelector('#gstinno');
    var f27eInput = stepsWrapper.querySelector('#f27Celigible');

    var requiredDocs = docWrapper.querySelectorAll('.required');


    requiredDocs.forEach(input=>{
      if(input.files.length === 0){
        input.style.border = '1px solid red';
        Toaster('error','Missing Documents',"Please Upload Required Documents !");
        validate = false;
      }

      input.addEventListener('change',event=> {
        if(event.target.files.length === 0){
          event.target.style.border = '1px solid red'
        }else{
          event.target.style.border = '1px solid green'
        }
      });

    })
    

    // Doc Inputs
    var gstDoc = stepsWrapper.querySelector('#gst_proof');
    var f27eDoc = stepsWrapper.querySelector('#f27c_doc');

    if(gstInput.value !== '' && gstDoc.files.length === 0){
      gstDoc.style.border = '1px solid red';
      validate = false;
      Toaster('error','Document Not Available',"Please Upload GSTIN Document !");
      return;
    }else if(gstDoc.files.length !== 0 && gstInput.value === ''){
      gstInput.style.border = '1px solid red';
      gstDoc.style.border = '1px solid green';
      validate = false;
      Toaster('error','GSTIN Missing',"Please Enter GSTIN Number As Per Your Document");
      return;
      
    }

    gstDoc.addEventListener('change',(event)=>{
      console.log(event);
      if(gstDoc.files.length !== 0) {
        gstDoc.style.border = '1px solid green';
      }else if(gstDoc.files.length === 0 && gstInput.value === ''){
        gstDoc.style.border = '1px solid #ced4da'; 
      }else if(gstDoc.files.length === 0 && gstInput.value !== ''){
        gstDoc.style.border = '1px solid red';
      }

    })

    if(f27eInput){
      if(f27eInput.value === 'Y' && f27eDoc.files.length === 0){
        f27eDoc.style.border = '1px solid red';
        validate = false;
        Toaster('error','Document Not Available',"Please Upload 27C Eligibility Document !");
        return;
      }else if(f27eInput.value === 'Y' && f27eDoc.files.length !== 0){
        f27eDoc.style.border = '1px solid green';
      }else if(f27eInput.value === 'N' && f27eDoc.files.length === 0){
        f27eDoc.style.border = '1px solid #ced4da';
      }

    }
    
    return validate;

  }

/**End Step Wizard */


// Verification

  async function sendApiReq(url,number){
    return new Promise(resolve=>{
      let reqData = data;
      $.ajax({
          type: "POST",
          url: host+url,
          data: reqData,
          success: function (response) {
              valResponse(response)
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

  async function verifyGst(event) { 
    var veryBtn = event.target;
    var number = document.getElementById('gstinno');

    await verifyGSTIN(number.value,(data)=>{
      console.log(data);
    })
    
  }

  async function verifyPancard(event) { 
    var veryBtn = event.target;
    var number = document.getElementById('pancard');

  }

  async function verifyIfsc(event) { 
    var veryBtn = event.target;
    var number = document.getElementById('ifsc');

  }
// End Verification

async function registeration(event){
    var formdata = new FormData(regForm);
    // var reqData = new FormData();
    var intrestedAreas = document.querySelectorAll(".fstControls .fstChoiceItem");
    var area = '';
  
    
    formdata.append('act','reg');
    if(regType.value === 'I'){
      formdata.append('pr.nm',formdata.get("pr.fnm")+" "+ formdata.get("pr.lnm").trim());
      formdata.append('f27c','-');

    }

    if(regType.value === 'F'){
      formdata.append('dob','-');
    }
    
    formdata.append('pr.typ',regType.value);
    intrestedAreas.forEach(itr=>{
      area+=itr.dataset.value + ",";
    })
    
    formdata.delete('comdty')
    formdata.append('comdty',area.slice(0,-1))
    
    for(let key of formdata.keys()){
      console.log(key,formdata.get(key));
    }
    
    if(fieldValidatore()){
      sendReq('prreg',formdata)
    }else{
      return;
    }
    
        
}

function fieldValidatore(stepname){
  var validate = true;

  // Personal info
  // var phoneVerify = document.querySelector('#registeration-form #verify-phone');
  // var emailVerify = document.querySelector('#registeration-form #verify-email');

  // if(phoneVerify.value !== "true"){
  //   Toaster('error','Mobile Not Verified !','Please Verify Your Mobile Number !')
  //   return false;
  // }else if(emailVerify.value !== "true"){
  //   Toaster('error','Email Not Verified !','Please Verify Your Email Number !')
  //   return false;
  // }else{
  //   return true
  // }

  return validate;
}

function fieldLoader(regtype){

  if(regtype === 'I'){

    fielLoader_PI.innerHTML = '';
    fielLoader_AC.innerHTML = '';
    fielLoader_DU.innerHTML = '';
    fielLoader_PI.append(document.importNode(pi_individual.content,true))
    fielLoader_AC.append(document.importNode(ac_individual.content,true))
    fielLoader_DU.append(document.importNode(du_individual.content,true))

    // console.log(document.getElementById('gstcheck'));

    document.getElementById('gstcheck').addEventListener('change',function () { 
      if(this.checked === false){
        document.querySelector('.gst-input').style.display = 'none';
        document.querySelectorAll('.gst-input input').forEach(input=>input.required = false)
      }else{
        document.querySelector('.gst-input').style.display = 'block';
        document.querySelectorAll('.gst-input input').forEach(input=>input.required = true)
      }
    })

    document.querySelector(".gst-input").style.display = 'none'


  }else{
    fielLoader_PI.innerHTML = '';
    fielLoader_AC.innerHTML = '';
    fielLoader_DU.innerHTML = '';
    fielLoader_PI.append(document.importNode(pi_firm.content,true))
    fielLoader_AC.append(document.importNode(ac_firm.content,true))
    fielLoader_DU.append(document.importNode(du_firm.content,true))
  }

  document.querySelector('.show-password').addEventListener('click',function(){

    if(this.textContent === 'show' ){
      this.previousElementSibling.type = 'text';
      this.textContent = 'hide';
    }else{
      this.textContent = 'show';
      this.previousElementSibling.type = 'password';
    }

  })
  

  document.querySelector('#state').addEventListener('change',(event)=>{
    var selectedOption =  event.target.options[event.target.selectedIndex];
    document.querySelector("#state-value").value = selectedOption.value;
    document.querySelector("#state-text").value = selectedOption.text;
    if(selectedOption.text === 'select'){
      document.querySelector("#state-text").value = '';
    }

  })

  document.querySelector('#verify_gstinno-btn').addEventListener('click',verifyGst)
  document.querySelector('#verify_pancard-btn').addEventListener('click',event=>{})
  document.querySelector('#verify_ifsc-btn').addEventListener('click',event=>{})

  document.querySelectorAll('.file-refresh-icon').forEach(icon=>{
    console.log(icon);
    icon.addEventListener('click',()=>{
      console.log(icon.previousElementSibling);
      icon.previousElementSibling.value = '';
    })
  })

  rawDataFiller(document.getElementById('state'),'states',regRawData)
  rawDataFiller(document.getElementById('que1_id'),'questions',regRawData)
  rawDataFiller(document.getElementById('que2_id'),'questions',regRawData)

}

function rawDataFiller(element,keyname,rawArray) { 
  var rawInfo = rawArray.find(info=>info.name === keyname);
  var options = '<option value="">select</option>'
  element.innerHTML = '';
  
  rawInfo.keyValues.forEach(keyvalue=>{
    options +=getOption(keyvalue.key,keyvalue.value);
  })

  element.innerHTML = options;

}

check_TC.addEventListener('change',function() {
    if(this.checked){
      fadeIn(regTypeWrapper)
    }else{
      fadeOut(regTypeWrapper)
      regType.value = 'none';
    }
  
})

regType.addEventListener('change',function() {
    if(this.value !== 'none' && check_TC.checked){
        fadeIn(stepsWrapper)
        fadeOut(landingPage)
        fieldLoader(this.value);
        $("#area_of_intrest").fastselect()
    }else{
        
    }
  
});
 
function containsSpecialChars(str) {
     const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
     return specialChars.test(str);
}
