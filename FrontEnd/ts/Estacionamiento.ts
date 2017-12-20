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
    public static  tablaCocheras(array:any){
        var table='<div class="col-md-12">';
        var flag:boolean=true;
        var e:any;
        (array.pisos).forEach(function(piso:any){
            var i=piso.idPiso*100
            while(i<(piso.idPiso*100+(piso.cantidadCocheras+piso.cantidadReservados)))
            {  table+='<div class="row">'
                var cell = 1;
                flag=true;
                while(cell <=12){
                    try{
                        if(i>(piso.idPiso*100+(piso.cantidadCocheras+piso.cantidadReservados))){
                            flag=false;
                             throw e;
                        }
                        (array.ocupados).forEach(function(auto:any)
                        {
                            if(auto.idCochera == i){
                                table+='<div class="col-md-1 col-sm-1 col-xs-12"><div class="row"><a  data-toggle="tooltip" title="Nº'+auto.idCochera+ '\nPatente:'+auto.patente+'\nColor: '+auto.color+'\nMarca:'+auto.marca+'"><i style="margin:0px 0px 0px  25px;color:red;" class="material-icons "  >directions_car</i></a></div><div class="row"><p class="text-center"style="color:white;">'+auto.idCochera+'</p></div></div>';
                                flag = false;
                                throw e;
                            }
                            else
                                flag = true;
                        });
                    }
                    catch(e){ }
                    if(flag)
                        table+='<div class="col-md-1 col-sm-1 col-xs-12"><div class="row"><i class="material-icons" style="margin:0px 0px 0px  25px;color:green;"  >directions_car</i></div><div class="row"><p class="text-center"style="color:white;">'+i+'</p></div></div>';
                   
                    i++;
                    cell++;
                }
                 table+='</div>'  
                 
             }
           
        });
     
        return table;
    }
}

