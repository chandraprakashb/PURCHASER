let cmdty = {};

function Main(comData){
    this.cmdty = comData;
    console.log("data in Main",this.cmdty)

    this.commodtyAssembler = function() {
        $(".search-dyna-spde").remove();
        this.cmdty.htmlcomp = {};

        this.cmdty.components.forEach(component => {
            if (component.attachedColumn) {
                let attchDtl = { ...component };
                attchDtl.inputName = component.attachedColumn;
                attchDtl.id = component.attachedColumn;
                this.cmdty.htmlcomp[component.attachedColumn] = attchDtl;
            }
            this.cmdty.htmlcomp[component.inputName] = component;
        });

        this.cmdty.searchable.forEach(serch=>{
            $("#searchable").prepend(this.createComponent(this.cmdty.htmlcomp[serch]))
        })

    }

    this.createComponent = function(dtl) {

        let cmp = $("<div class='col-md-3 search-input-wrapper' >");
    
        $(cmp).append($('<label>').attr('for', dtl.id).text(dtl.label+":"));
    
        if (dtl.type == 'select') {
           let sel = $('<select class="" name="' + dtl.inputName + '" attachedColumn="' + dtl.attachedColumn + ' id="' + dtl.id + '">');
           $(sel).append(this.getOption('Select ' + dtl.label, '') + this.getOptionList(this.cmdty.dataprovider[dtl.provider], 'value', 'text'));
           $(cmp).append(sel);
        }else {
           $(cmp).append($('<input type="text" class="" name="' + dtl.inputName + '" id="' + dtl.id + '">'));
        }
    
        // $("#searchable").append(cmp);
        // console.log('Component ', cmp);
        return cmp;

    }
    
    // this.renderTable = function(rowdata,viewClick) {

    //     let gridOptions = {
    //         columnDefs:[],
    //         rowData:rowdata ? rowdata :[],
    //     }

    //     function cellRenderer(param) { 
    //         var span = document.createElement('span');
    //         span.innerHTML = '<i class="metismenu-icon pe-7s-look"></i>';
    //         span.style.fontSize = '20px';
    //         span.style.cursor = 'pointer';
    //         span.addEventListener('click', () => {
    //             if(viewClick){
    //                 viewClick(param.data);
    //             }
    //         });
    //         return span;
    //     }


    //     this.cmdty.tabledata.forEach(tablerow=>{
    //         let coldef = {}

    //         // Manage Main Columns
    //         let colinfo = this.cmdty.htmlcomp[tablerow.header]

    //         coldef.headerName = colinfo.label;
    //         coldef.field = (colinfo.id).replace(/\./g, '_');

    //         // Manage Extra Detail
    //         let dtls = Array.from(tablerow.dtls.split(','));
    
    //             dtls.forEach(dtl=> {
    //                 let details = dtl.split(':');
    //                 let dt2 = (details[1]).trim();
    //                 coldef[(details[0]).trim()] = dt2 ==='true' ? true : dt2 ==='false' ? false:dt2;
    //             })
 
    //         gridOptions.columnDefs.push(coldef)
    //     })


    //     if(viewClick) {
    //         gridOptions.columnDefs = [{headerName:'View',field:"view",cellRenderer:cellRenderer},...gridOptions.columnDefs]
    //         this.agGridTableLogic(gridOptions);
    //     }else{
    //         this.agGridTableLogic(gridOptions)
    //     }

    // }

    // this.agGridTableLogic = function(gridoption){

    //     var gridDiv = document.querySelector('#lotinfo_table');
    //     $(gridDiv).empty()
    //     new agGrid.Grid(gridDiv, gridoption);

    // }

    this.getOption =(text,value)=> {
        return `<option value="${value}">${text}</option>`;
    }
    
    this.getOptionList =(lst, text, value)=> {
        let opt = '';
        $(lst).each(function (i){
            opt += '<option value="' + lst[i][text] + '"> ' + lst[i][value] 
    +' </option>'
        });
        return opt;
    }
    
}


/**
 * config
 * tableWrapper: table render
 * predefindeColumns:[] array of 
 * 
 */

function RenderDynamicTable(config){

    this.mainSetup = () =>{

    }


    this.mainSetup();
}