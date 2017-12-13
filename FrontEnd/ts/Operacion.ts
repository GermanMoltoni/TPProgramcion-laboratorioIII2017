/// <reference path="./Ajax.ts" />

class Operacion{
    public static getForm(){
        return {
            id:$("#sel-usr").val(),
            from:$("#in_desde").val(),
            to:$("#in_hasta").val(),
            export:''
        };
    }
 
}

class Formato{
    public static validator(obj_param:any){
        var id_form = obj_param.id_form || null;
        var opciones = obj_param.opciones || null;
        let callback = obj_param.callback || null;
        if(opciones != null && id_form != null){
            $("#"+id_form).bootstrapValidator('destroy');  
            return $("#"+id_form).bootstrapValidator(opciones).
            on('success.form.bv',(e:Event)=>{
                if(typeof callback === 'function'){
                    callback();
                }
                e.preventDefault();
            });
        }
    } 
}
