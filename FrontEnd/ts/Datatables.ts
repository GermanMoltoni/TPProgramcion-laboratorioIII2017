class DataTable{
    private dt:any;
    private id_tabla:string;
    public path:string;
    constructor(id_tabla:string){
        this.id_tabla = id_tabla;
    }
    public setPath(path:string){
        this.path = path;
    }
    public ajax(columns:any){
        $('#' + this.id_tabla).DataTable().destroy();
        this.dt = $('#' + this.id_tabla).DataTable({
            autoWidth: false,
            destroy: true,
            ajax:{ url:this.path,
            dataSrc:(data:any)=>{
                if(data =="{}" )
                    return {};
                return data;
            }},
            info: false,
            select: true,
            searching: true,
            scroller: {
                loadingIndicator: true
            },
            paging: false,
            scrollY: 400,
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