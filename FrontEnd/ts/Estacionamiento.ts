$(document).ready(()=>{
    $("#a-estacionamiento").click((e)=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",true);
        $("#estacionamiento").prop("hidden",false);
        
    });
    $("#btn-ingreso-auto").click((e)=>{
        $("#modal-ingreso-vehiculo").modal("show");
        e.preventDefault();
    });
});

class Estacionamiento{
    
}

var validator_ingreso_vehiculo = {
    id_form:"form_ingreso_vehiculo",
    callback:()=>{
            Usuario.modificar().done((e:any)=>{
                tabla_usuarios.reloadTable();
            },()=>{}); 
        $("#modal-ingreso-vehiculo").modal("hide");
    },
    opciones:{
        message: 'Este valor no es valido',
        fields: {
            in_dominio:{
                validators:{
                    notEmpty:{message:'Ingrese Dominio'},
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