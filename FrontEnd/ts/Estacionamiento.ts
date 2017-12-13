$(document).ready(()=>{
    $("#a-estacionamiento").click((e)=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",true);
        $("#operaciones").prop("hidden",true);
        $("#estadistica").prop("hidden",true);
        $("#estacionamiento").prop("hidden",false);
    });
    $("#btn-ingreso-auto").click((e)=>{
        $("#modal-ingreso-vehiculo").modal("show");
        $('#form_ingreso_vehiculo').bootstrapValidator('resetForm', true);
        ValidadorForm(validator_ingreso_vehiculo);
        e.preventDefault();
    });
    $("#btn-egreso-auto").click((e)=>{
        $("#modal-egreso-vehiculo").modal("show");
         $('#form_egreso_vehiculo').bootstrapValidator('resetForm', true);
         ValidadorForm(validator_egreso_vehiculo);
        e.preventDefault();
    });
    
});




var validator_ingreso_vehiculo = {
    id_form:"form_ingreso_vehiculo",
    callback:()=>{
        $("#modal-ingreso-vehiculo").modal("hide");
        Estacionamiento.ingresar().done((e)=>{
            $("#btn-eliminar-usr").addClass("hide_me"); 
            if(e.cochera != undefined)               
                $("#msg-info").text( 'Cochera Asignada:'+e.cochera);
            else
                $("#msg-info").text(e.error);
            $("#modal-info").modal("show");
        });
    },
    opciones:{
        message: 'Este valor no es valido',
        fields: {
            in_dominio:{
                validators:{
                    callback:{
                        message:'Ingrese Dominio',
                        callback:(value:any)=>{
                   
                        }
                    }
                }
            },
            in_color:{
                validators:{
                    notEmpty:{message:'Ingrese Color'},
                }
            },
            in_marca:{
                validators:{
                    notEmpty:{message:'Ingrese Marca'},
                }
            },
        }
    }
};

var validator_egreso_vehiculo = {
    id_form:"form_egreso_vehiculo",
    callback:()=>{
        $("#modal-egreso-vehiculo").modal("hide");
        Estacionamiento.retirar().done((e)=>{
            $("#btn-eliminar-usr").addClass("hide_me"); 
            if(e.error != undefined){
                $("#msg-info").text(e.error);
                $("#modal-info").modal("show");
            }        
            else{
                Estacionamiento.setTicket(e);
                $("#modal-tk-vehiculo").modal("show");
                
            }
        });
    },
    opciones:{
        message: 'Este valor no es valido',
        fields: {
            in_dominio_egre:{
                validators:{
                    callback:{
                        message:'Ingrese Dominio',
                        callback:(value:any)=>{
                   
                        }
                    }
                }
            },
        }
    }
};




class Estacionamiento{
    public static ingresar(){
        return Ajax.post('estacionamiento/ingreso',Estacionamiento.getFormIngreso());
    }
    public static retirar(){
        return Ajax.delete('estacionamiento/egreso/'+encodeURI(Estacionamiento.getFormEgreso()));
    }
    public static getFormIngreso(){
        return {
            color:$("#in_color").val(),
            patente:$("#in_dominio").val(),
            especial:$("#vehi_esp").is(":checked")?'1':'0',
            marca:$("#in_marca").val(),
        }
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

