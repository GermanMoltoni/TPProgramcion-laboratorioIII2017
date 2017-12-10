$(document).ready(()=>{
    $("#a-estacionamiento").click((e)=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",true);
        $("#estacionamiento").prop("hidden",false);
        
    });
    $("#btn-ingreso-auto").click((e)=>{
        $("#modal-ingreso-auto").modal("show");
    });
});

class Estacionamiento{
    
}

var validator_modificar_usuario = {
    id_form:"form_usuario",
    callback:()=>{
            Usuario.modificar().done((e:any)=>{
                tabla_usuarios.reloadTable();
            },()=>{}); 
        $("#modal-nuevo-usuario").modal("hide");
    },
    opciones:{
        message: 'Este valor no es valido',
        fields: {
            in_nombre:{
                validators:{
                    notEmpty:{message:'Ingrese Nombre'},
                }
            },
        }
    }
};