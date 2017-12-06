class DataTable{
    private dt:any;
    private id_tabla:string;
    constructor(id_tabla:string){
        this.id_tabla = id_tabla;
    }
    public  ajax(columns:any,path:string){
        $('#' + this.id_tabla).DataTable().destroy();
        this.dt = $('#' + this.id_tabla).DataTable({
            autoWidth: false,
            destroy: true,
            ajax:{ url:path,
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
        $('#' + this.id_tabla + ' tbody').off('click', 'tr').on('click', 'tr',()=>{
            if ($(this).hasClass('selected')){//cambiar
                $(this).removeClass('selected');//cambiar
                sessionStorage.removeItem(nombre_item);
                if(fn_nosel !== null)
                    fn_nosel();
            }
            else{
                let datos = this.dt.row(this).data();//cambiar
                sessionStorage.setItem(nombre_item, JSON.stringify(datos));
                $(this).addClass('selected');//cambiar
                if(fn_sel !== null)
                    fn_sel();
            }
        });
    }
}