class Estacionamiento{
    public static ingresar(auto:Auto){
        return Ajax.post('estacionamiento/ingreso',auto);
    }
    public static retirar(){
        return Ajax.delete('estacionamiento/egreso/'+encodeURI(Estacionamiento.getFormEgreso()));
    }
    public static setTicket(datos:any){
        $("#lbl-dom-salida").text(datos.patente);
        $("#lbl-cochera-salida").text(datos.idCochera);
        $("#lbl-entrada-salida").text(datos.entrada);
        $("#lbl-salida-salida").text(datos.salida);
        $("#lbl-pago-salida").text(datos.pago);
        $("#lbl-tiempo-salida").text(datos.tiempo);
    }
    public static getFormEgreso(){
        return $("#in_dominio_egre").val();
    }
}

