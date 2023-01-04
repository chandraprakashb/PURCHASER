// Hierarchy
function TreeView(datas, options) {
    this.root = document.createElement("div");
    this.root.className = "treeview";
    let t = this;



    var defaultOptions = {
        showAlwaysCheckBox: true,
        fold: true,
        openAllFold:false
    }

    options = Object.assign(defaultOptions, options);


    // GROUP EVENTS ---------------------

    function groupOpen() {
        $(this).parent().find(">.group").slideDown("fast");
    }
    function groupClose() {
        $(this).parent().find(">.group").slideUp("fast");
    }
    function groupToggle() {
        $(this).parent().find(">.group").slideToggle("fast");
    }



    // ITEM EVENTS --------------------
    function changeCheckState(value, allChildCheck) {
        var c = this.checked;

        if (value == null || value instanceof MouseEvent) { // TOGGLE CHECK
            if (c == 0) c = 1;
            else if (c == 1) c = 0;
            else if (c == 2) c = 1;
        } else {
            c = value;
        }
        this.checked = c;
        setCheckState.bind(this)(c);


        if (c != 2)
            checkAllChilds.bind(this)(c);
        checkControlParents.bind(this)();
    }

    function checkAllChilds(value) {

        var $group = $(this).parent(".group");
        $group.find(".item").each(function (index, el) {
            setCheckState.bind(el)(value)
        })

    }

    function checkControlParents() {
        var $parents = $(this).parents(".treeview .group");

        for (var index = 1 ; index < $parents.length ; index++) {
            var el = $parents[index];
            item = $(el).find(">.item").get(0);
            $children = $(el).find(".group .item");
            var all1 = true;
            var all0 = true;
            for (var i = 0; i < $children.length; i++) {
                if ($children[i].checked != 1) all1 = false;
                if ($children[i].checked != 0) all0 = false;
            }
            if (all1) setCheckState.bind(item)(1);
            else if (all0) setCheckState.bind(item)(0);
            else setCheckState.bind(item)(2);
        }
    }

    function setCheckState(value) {

        this.checked = value
        this.setAttribute("check-value", value)
        if (value == 0) {
            $(this).find(">[check-icon]")[0].className = "fa fa-circle-thin";
        }
        if (value == 1) {
            $(this).find(">[check-icon]")[0].className = "fa fa-check-circle-o";
        }
        if (value == 2) {
            $(this).find(">[check-icon]")[0].className = "fa fa-dot-circle-o";
        }
    }

    /* FIRST CREATION */

    function createTreeViewReq(parentNode, datas, options) {


        //console.log("datas len:",datas.length, "datas:",datas);
        for (var i = 0; i < datas.length; i++) {
            if (datas[i] != null) {
                //console.log("datas i:", i, "data:", datas)
                var data = datas[i];
                var item = createSingleItem(data);
                parentNode.appendChild(item);
                if ("children" in data && data.children.length > 0) {
                    createTreeViewReq(item, data.children, options)
                }
            }
        }
    }

    function createSingleItem(data) {
        var group = document.createElement("p");
        group.className = "group"
        if ("className" in options)
            group.className += options.className;

        if ("fold" in options) {
            var foldButton = document.createElement("i");
            foldButton.className = "fa fa-caret-right";
            foldButton.setAttribute("fold-button", 1);
           
            foldButton.onclick = groupToggle.bind(foldButton);

            foldButton.isOpened = options.fold;
            
            group.appendChild(foldButton)
        }

        // ALERT ADD ICON
        var item = document.createElement("span");
        item.className = "item";
        item.innerHTML = data.text;
        item.data = data;
        for (var keys = Object.keys(data), i = 0; i < keys.length ; i++) {
            item.setAttribute("data-" + keys[i], data[keys[i]]);
        }
        if ("checked" in data || options.showAlwaysCheckBox == true) {
            var checked = document.createElement("i");
            checked.setAttribute("check-icon", "1");
            checked.className = "fa ";

            item.prepend(checked);

            if ("checked" in data && data.checked) {
                setCheckState.bind(item)(data.checked ? 1 : 0);
            } else {
                setCheckState.bind(item)(0);
            }

        }

        item.onclick = changeCheckState.bind(item);

        group.appendChild(item)
        return group;
    }




    this.update = function () {
        $(t.root).find(".group").each(function (index, el) {
            if ($(el).find(".group").length > 0) {
                $(el).find(">[fold-button]").css("visibility", "visible");
            } else {
                $(el).find(">[fold-button]").css("visibility", "hidden");
            }
            checkControlParents.bind($(el).find(">.item"))();
        })

    }

    this.load = function (datas) {
        $(this.root).empty();
        createTreeViewReq(this.root, datas, options);
        this.update();
    }
    this.save = function (type, node) {
        if (type == null) type = "tree";


        if (type == "tree") {
            if (node == null) {
                var data = [];
                var $children = $(this.root).find(">.group");
                for (var i = 0; i < $children.length; i++) {
                    var child = this.save("tree", $children[i])
                    data.push(child)
                }
                return data;
            } else {
                var data = saveSingle($(node).find(">.item")[0]);
                data.children = []
                var $children = $(node).find(">.group");

                for (var i = 0; i < $children.length; i++) {
                    var child = this.save("tree", $children[i])
                    data.children.push(child);
                }
                return data;
            }

        }

        if (type == "list") {
            var data = [];
            var $items = $(this.root).find(".item");
            for (var i = 0; i < $items.length; i++) {
                data.push(saveSingle($items[i]));
            }
            return data;
        }
    }
    function saveSingle(el) {
        if (el == null) el = this;
        ret = Object.assign(
            { children: [] },
            el.data,
            { checked: el.checked });

        return ret;
    }

    this.load(datas);
    this.openAllFold = function (item) {
        if (item == null) item = this.root;
        $(item).find("[fold-button]").each(function (index, el) {
            
            groupOpen.bind(this)();
        })
    }
    this.closeAllFold = function (item) {
        if (item == null) item = this.root;
        $(item).find("[fold-button]").each(function (index, el) {

            groupClose.bind(this)();
        })
    }
    
    if (options.openAllFold) {
        this.openAllFold();
    } else {
        this.closeAllFold();
    }
    return this;

}

function treeDataGeneratore(rawData,ownid__key,undid__key,textkey__key) { 
    var treedata = [];
    var treeobject = [];

    rawData.forEach(raw =>{
        let tree = { text:raw[textkey__key], id:raw[ownid__key], undid:raw[undid__key], children:[]};
        treedata.push(tree);
    });
    
    childTreeHandler(treedata,treeobject);
    treeobject = treeobject.filter(object=>object.undid === 0);
    
    return treeobject;

}

function childTreeHandler(treedata = [],treeobject = []) { 
    treedata.forEach(data=>{
        let trdata = data;
        let children = treedata.filter(dt => dt.undid === trdata.id);
        trdata.children= [...children];
        childTreeHandler(trdata.children)
        treeobject.push(trdata);
    });
}

function renderHierarchy(container,treeObject) { 

    var tw = new TreeView(
    treeObject,
    { 
        showAlwaysCheckBox:true,
        fold:false
    }
    );

    $(container).empty();
    $(container).append(tw.root)
}
// End Hierarchy

function tdGeneratore(innerHTML){
    var td = document.createElement('td');
        td.innerHTML = innerHTML;  
    
    return td;
}

function sendHttpRequest__TEMP(url,data) { 
    return new Promise(resolve=>{
        appLoader.style.display = 'flex';
        let reqData = data;
        reqData.delete('TOKEN');
        reqData.append('TOKEN',localStorage.getItem('token'));
        $.ajax({
            type: "POST",
            url: tempHots+url,
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

function formdataToObject(formData,removeEmtyKey = false){
    let object = {};

    for(let key of formData.keys()){
        object[key] = formData.get(key)
    }

    if(removeEmtyKey){
        for(let emptyKey in object){
            if( 
                object[emptyKey] === '' ||
                object[emptyKey] === 'none' ||
                typeof object[emptyKey] === 'object'){
                    delete object[emptyKey]
            }
        }
    }

    console.log(object);

    return object;
}

function manageUnder(mainEl,subEls,text_value_under,ofcdata){
    console.log(ofcdata);
    var optData = ofcdata;
    var mainEl = document.querySelector(mainEl);
    var subEls = subEls;
    var opts = '<option value="none">Please Select</option>';

    mainEl.innerHTML = '';
    optData.forEach(data=>{
        opts+=getOption(data[text_value_under[0]],data[text_value_under[1]])
    })


    mainEl.innerHTML = opts;

    mainEl.addEventListener('change',()=>{
        var underdata = ofcdata.filter(dt=> dt.UND_OFCID === parseInt(mainEl.value));

        console.log(mainEl.value);
        console.log(underdata);

        subEls.forEach(subel=>{
            var sub = document.querySelector(subel);
            var opt = '<option value="none">Please Select</option>';

            underdata.forEach(unddata=>{
                opt+=getOption(unddata[text_value_under[0]],unddata[text_value_under[1]])
            })

            sub.innerHTML = '';
            sub.innerHTML = opt;

        })
    })


}

function specificationLoder(row,specJSON){
    specJSON.forEach(specification=>{
        var specEl = row.querySelector("."+specification['dom-id']);
        var opts = '<option value="none">Select</option>';
        specification.keyValues.forEach(keyvalue=>{
            opts+=getOption(keyvalue.key,keyvalue.value)
        })
        specEl.innerHTML = opts;
    });
}

function confirmation(title,clbk,message="Are You Sure ?"){

    $('#confirmation-box').confirmAction({
        title: {
            text: title
        },
        message: {
            text: message
        },
        actions: {
            confirm: {
            text: 'Okey',
            callback: function(confirm, cancel) {
                    console.log("Called");
                    document.querySelector('.confirm-action-modal-close').addEventListener('click',()=>document.querySelector(".confirm-action-modal").remove() )
                    document.querySelector(".confirm-action-modal").remove() 
                    clbk()
                }
            }
        }


    });



    document.querySelector("#confirmation-box").click();   

}

function closeSidebar(){
    var appContainer = document.querySelector(".app-container");
    var hamburgerElastic = document.querySelector('.hamburger--elastic');

    if(appContainer.classList.contains('closed-sidebar') === false){
        hamburgerElastic.click()
    }

}

function fadeIn(...elements) { 
    elements.forEach(element=>{
        $(element).fadeIn(1000);
    })
}

function fadeOut(...elements) { 
    elements.forEach(element=>{
        $(element).fadeOut(100);
    })
}
 
async function verifyGSTIN(gstin,successCallbk){
    $.ajax({
        type: "GET",
        url: `https://blog-backend.mastersindia.co/api/v1/custom/search/gstin?keyword=${gstin}&unique_id=zluF4K9rQC4Y0Gf6TP9Vfl7A6YvDLr`,
        data: '',
        processData: false,
        contentType:false,
        timeout: 600000,
        success: function (response) {
            if(successCallbk){
                successCallbk(response)
            }

            if(response.success){
                Toaster('success','Veryfied !',"Your GST No. Verified Successfully !")
            }else{
                Toaster('error','Not Veryfied !',"Your GST No. Not Verified !")
            }
        },
        error: function(response){

        }
    });
}

function Modal(id){
        this.modal = document.querySelector('#'+id);
        this.modal.classList.add('my-popup')
        this.closeBtn = this.modal.querySelector('#close-btn')
        this.show = () =>{
            fadeIn(this.modal)
            closeSidebar()
        }

        this.hide = () =>{
            fadeOut(this.modal)
        }
        this.hide()
        this.closeBtn.addEventListener('click',this.hide)
}

function RenderTimeInput (){
    
    this.inputWrapper = document.querySelectorAll('.need-time');

    this.inputData = {
        hours:['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','00'],
        mintsAdnSecs:['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','00'],
    }
    this.mainRow;

    this.hours = '<select class="hh" name="hh" required><option value="" selected>HH</option>'
    this.minutes = '<select class="mm" name="mm" required><option value="" selected>MM</option>';
    this.seconds = '<select class="ss" name="ss" required><option value="" selected>SS</option>';

    this.inputData.hours.forEach(hour=>{
        this.hours+=`<option value='${hour}'>${hour}</option>`;
    });
    this.inputData.mintsAdnSecs.forEach(mintsSecs=>{
        this.minutes+=`<option value='${mintsSecs}'>${mintsSecs}</option>`;
        this.seconds+=`<option value='${mintsSecs}'>${mintsSecs}</option>`;
    });

    this.hours   +=  '</select>';
    this.minutes +=  '</select>';
    this.seconds +=  '</select>';

    this.mainRow = `<div class="row">
                        <div class="col-4">${this.hours}</div>
                        <div class="col-4">${this.minutes}</div>
                        <div class="col-4">${this.seconds}</div>
                    </div>`

    this.inputWrapper.forEach(wrapper=>{
        wrapper.innerHTML = this.mainRow;
    })
}