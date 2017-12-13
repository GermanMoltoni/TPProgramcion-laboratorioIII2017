//        $('#os_pac_des').DataTable().columns.adjust().draw();

class DataTable{
    private dt:any;
    private url:string='http://localhost/TPProgramcion-laboratorioIII2017/Api/';
    private id_tabla:string;
    private search:boolean;
     constructor(id_tabla:string,search?:boolean){
        this.id_tabla = id_tabla;
        this.search = search != undefined?search:true;
    }
    public iniciar(){
        $('#' + this.id_tabla).DataTable().destroy();        
        $("#"+this.id_tabla).DataTable({
            searching:false,
            paging:false,
            info:false
        });
    }
    public ajax(columns:any,path:string){
        console.log(123)
        $('#' + this.id_tabla).DataTable().destroy();
        
        this.dt = $('#' + this.id_tabla).DataTable({
            autoWidth: false,
            destroy: true,
            ajax:{ url:this.url+path,
            dataSrc:(data:any)=>{
                if(data =="{}" )
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