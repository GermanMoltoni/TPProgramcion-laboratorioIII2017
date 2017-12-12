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


function FechaSql(fecha:string){
    let aux = fecha.split('');
    let fec = aux[0].split('-');
    let hor = aux[1];
    return fec[2]+'-'+fec[1]+'-'+fec[0]+' '+hor;
}