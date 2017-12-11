$(document).ready(()=>{
    $("#a-estacionamiento").click((e)=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",true);
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
       // $('#form_egreso_vehiculo').bootstrapValidator('resetForm', true);
        //ValidadorForm(validator_ingreso_vehiculo);
        e.preventDefault();
    });
    
});

function selectUsuarios(id_div:string,usuarios:any){
    
}


var validator_ingreso_vehiculo = {
    id_form:"form_ingreso_vehiculo",
    callback:()=>{
        $("#modal-ingreso-vehiculo").modal("hide");
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


