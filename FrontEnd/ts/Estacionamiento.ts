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
    public static verificarLugares(){
        let datos = localStorage.getItem('lugares');
        let lugares;
        let pisos;
        if(datos !== null){
            lugares = JSON.parse(datos).ocupados; 
            pisos = JSON.parse(datos).pisos; 
            let cap:number=0;
            pisos.forEach((piso:any) => {
                cap+= piso.cantidadCocheras + piso.cantidadReservados;
            });
            
            return lugares.length < cap;
        }
    }
}

