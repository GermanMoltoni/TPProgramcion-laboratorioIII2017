//        $('#os_pac_des').DataTable().columns.adjust().draw();
var lenguage = {
    searchPlaceholder: "Filtrar",
    search: "_INPUT_",
    emptyTable: "Sin Datos",
    infoEmpty: "Sin Datos",
    zeroRecords: "No hay datos coincidentes",
    //loading: "<span ><img src='./info_vista/images/icon/spinner.gif'></span>",
    //processing: "<span ><img src='./info_vista/images/icon/spinner.gif'></span>",
    paginate: {
        previous: '<p style="color: black;">Anterior</p>',
        next: '<p style="color: black;">Siguiente</p>'
    },
    lengthMenu: "Ver _MENU_ registros",
    loadingRecords: 'Cargando...'
};
class DataTable{
    public dt:any;
    private url:string='http://localhost:8080/TPProgramcion-laboratorioIII2017/Api/';
 //private static url:string = 'http://germanmoltoni.esy.es/final/Api/';
  
    //private url:string='http://localhost/TPProgramcion-laboratorioIII2017/Api/';
    private id_tabla:string;
    private search:boolean;
     constructor(id_tabla:string,search?:boolean){
        this.id_tabla = id_tabla;
        this.search = search != undefined?search:true;
        this.iniciar();
    }
    private iniciar(){
        $('#' + this.id_tabla).DataTable().destroy();        
        $("#"+this.id_tabla).DataTable({
            searching:false,
            paging:false,
            info:false,
            language:lenguage
        }).clear().draw();
    }
    public data(columns:any,data:any){
        $('#' + this.id_tabla).DataTable().destroy();
        
        this.dt = $('#' + this.id_tabla).DataTable({
            autoWidth: false,
            destroy: true,
            data:data,
            info: false,
            select: true,
            searching: this.search,
            scroller: {
                loadingIndicator: true
            },
            paging: false,
            scrollY: 250,
            scrollX: true,
            scrollCollapse: true,
            columns:columns,
            language:lenguage,            
            dom: '<"top"i>rt<"bottom"flp><"clear"><"toolbar">',
        });
        
    }
    public ajax(columns:any,path:string){
        $('#' + this.id_tabla).DataTable().destroy();
        
        this.dt = $('#' + this.id_tabla).DataTable({
            autoWidth: false,
            destroy: true,
            ajax:{ headers:{'token':Ajax.getToken()},
                url:this.url+path,
            dataSrc:(data:any)=>{
                if(data =="{}" || data.error != undefined || data.msg != undefined)
                    return {};
                return data;
            }},
            info: false,
            select: true,
            searching: this.search,
            scroller: {
                loadingIndicator: true
            },
            paging: false,
            scrollY: 250,
            scrollX: true,
            scrollCollapse: true,
            columns:columns,
            language:lenguage,            
            dom: '<"top"i>rt<"bottom"flp><"clear"><"toolbar">',
        });
        
    }
    public reloadTable(){
        this.dt.ajax.reload();
    }
    public selectFila(fn_sel:any=null,fn_nosel:any=null){
        let nombre_item = 'tr-' + this.id_tabla;
        sessionStorage.removeItem(nombre_item);
        $('#' + this.id_tabla + ' tbody').off('click', 'tr').on('click', 'tr',(e, dt, type, indexes )=>{
            if ($(e.currentTarget).hasClass('selected')){//cambiar
                sessionStorage.removeItem(nombre_item);
                if(fn_nosel !== null)
                    fn_nosel();
            }
            else{
                let datos = this.dt.row(e.currentTarget).data();//cambiar
                sessionStorage.setItem(nombre_item, JSON.stringify(datos));
                if(fn_sel !== null)
                    fn_sel();
            }
        });
    }
}