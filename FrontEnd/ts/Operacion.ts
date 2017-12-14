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
    public static vaciarForm(){
        $("#in_desde").val('');
        $("#in_hasta").val('');
        $("#sel-usr").val('');
    }
 
}
