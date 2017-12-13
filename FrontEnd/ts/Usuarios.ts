var tabla_usuarios:DataTable;
$(document).ready(()=>{
    
    $("#a-login").click((e)=>{
        $("#form-login").prop("hidden",false);
        $("#usuarios").prop("hidden",true);
        $("#estacionamiento").prop("hidden",true);
        $("#estadistica").prop("hidden",true);
        $("#operaciones").prop("hidden",true);
         e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#btn-login").click((e)=>{
        let login = new Auth($("#mail").val(),$("#password").val());
        login.login().done((e:any)=>{
            console.log(e)
            Usuario.setUsuario(e.user);
            Ajax.setToken(e.token);
            if(e.error != undefined){
                $("#btn-eliminar-usr").addClass("hide_me");                
                $("#msg-info").text(e.error);
                $("#modal-info").modal("show");
            }
            else{
                if(Usuario.getTipo()){
                    $("#form-login").prop("hidden",true);
                    $("#ul-admin").removeClass("hide_me");
                }
                else{
                    $("#form-login").prop("hidden",true);
                    $("#ul-user").removeClass("hide_me");
                }
                $("#ul-login").prop("hidden",true);
                $("#ul-logout").prop("hidden",false); 
            }
        },()=>{}); 
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#a-logout").click((e)=>{
        Auth.logout();
        $("#ul-login").prop("hidden",false);
        $("#ul-logout").prop("hidden",true);
        $("#ul-admin").addClass("hide_me");
        $("#ul-user").addClass("hide_me");
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#btn-carga-login").click((e)=>{
        Auth.setForm();
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#btn-nuevo-usuario").click((e)=>{
        $('#admin_usr').bootstrapToggle('off');
        $('#form_usuario').bootstrapValidator('resetForm', true);
        ValidadorForm(validator_nuevo_usuario);
        $("#modal-nuevo-usuario").modal("show");
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#btn-modificar-usuario").click((e)=>{
        let datos = sessionStorage.getItem('tr-tabla_usuarios');
        let usuario = JSON.parse(datos !== null?datos:'');
        usuario = Usuario.jsonToUsuario(usuario);
        usuario.setForm();
        ValidadorForm(validator_modificar_usuario);
        $("#modal-nuevo-usuario").modal("show");
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#a-usuarios-lis").click((e)=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",false);
        $("#estacionamiento").prop("hidden",true);
        $("#estadistica").prop("hidden",true);
        
        tabla_usuarios = new DataTable("tabla_usuarios");
        tabla_usuarios.ajax(
            [                
                {render:function(data:any,type:any,row:any){return row.nombre+','+row.apellido;}},
                {render:function(data:any,type:any,row:any){
                    let turno;
                    switch (row.turno){
                        case 1:
                            turno = 'Mañana';
                            break;
                        case 2:
                            turno = 'Tarde';
                            break;
                        case 3:
                            turno = 'Noche';
                            break;
                        default:
                            turno = 'Sin Turno';
                            break;
                    }
                      return turno;  
                     }},
                {render:function(data:any,type:any,row:any){
                        return row.estado == 1?'<span class="badge" style="background-color:green;">Habilitado</span>':'<span class="badge" style="background-color:red;">Suspendido</span>';}},   
                {render:function(data:any,type:any,row:any){
                    return row.admin == 1?'Administrador':'Empleado';}},
                    {render:function(data:any,type:any,row:any){
                        return row.pathFoto == null?'Sin Foto':'<img src='+row.pathFoto+'>';}},
            ]
         ,'usuario/listar');
        tabla_usuarios.selectFila();
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $('#admin_usr').bootstrapToggle({
        on: 'Si',
        off: 'No'
    });
    $("#admin_usr").change(()=>{
        if($("#admin_usr").is(":checked"))
            $("#sel_turno").prop("disabled",true);
        else
            $("#sel_turno").prop("disabled",false);
        $("#form_usuario").bootstrapValidator('validateField', 'sel_turno');    
    });
    $("#btn-estado-usuario").click((e)=>{
        let datos = sessionStorage.getItem('tr-tabla_usuarios');
        let usuario = JSON.parse(datos !== null?datos:'');
        usuario = Usuario.jsonToUsuario(usuario);
        usuario.cambiarEstado().done((e:any)=>{
            tabla_usuarios.reloadTable();
        },()=>{});
        e.preventDefault();
    });
    $("#btn-baja-usuario").click((e)=>{
        $("#msg-info").text("¿Desea borrar el usuario?");
        $("#btn-eliminar-usr").removeClass("hide_me");
        $("#modal-info").modal("show");
        e.preventDefault();
    });
    $("#btn-eliminar-usr").click((e)=>{
        let datos = sessionStorage.getItem('tr-tabla_usuarios');
        let usuario = JSON.parse(datos !== null?datos:'');
        usuario = Usuario.jsonToUsuario(usuario);
        Ajax.delete('usuario/baja',{id:usuario.id}).done(()=>{
            tabla_usuarios.reloadTable();
            $("#btn-eliminar-usr").addClass("hide_me");
            $("#modal-info").modal("hide");
        });
        e.preventDefault();
    });
});
function ValidadorForm(obj_param:any){
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

var validator_nuevo_usuario = {
    id_form:"form_usuario",
    callback:()=>{
        Usuario.crear().done((e:any)=>{
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
            in_apellido:{
                validators:{
                    notEmpty:{message:'Ingrese Apellido'}
                }
            },
            sel_turno:{
                validators:{
                    callback:{
                        message:'Ingresar Documento',
                        callback:(value:any)=>{
                            if(!$("#admin_usr").is(":checked"))
                                return true;
                            else
                                return value > 0;
                        }
                    }
                }
            },
            in_mail:{
                validators:{
                    notEmpty:{message:'Ingrese Mail'},
                    emailAddress: {
                        message: 'No es un mail válido'
                    }
                }
            },
            in_passwd1:{
                validators:{
                    notEmpty:{message:'Ingrese Password'},
                    identical:{
                        field:'in_passwd2',
                        message:'No coincide el password'
                    }
                }
            },
            in_passwd2:{
                validators:{
                    notEmpty:{message:'Verificar Password'},
                    identical:{
                        field:'in_passwd1',
                        message:'no coincide el password'
                    }
                }
            }
        }
    }
};
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
            in_apellido:{
                validators:{
                    notEmpty:{message:'Ingrese Apellido'}
                }
            },
            sel_turno:{
                validators:{
                    callback:{
                        message:'Ingresar Documento',
                        callback:(value:any)=>{
                            if(!$("#admin_usr").is(":checked"))
                                return true;
                            else
                                return value > 0;
                        }
                    }
                }
            },
            in_mail:{
                validators:{
                    notEmpty:{message:'Ingrese Mail'},
                    emailAddress: {
                        message: 'No es un mail válido'
                    }
                }
            },
            in_passwd1:{
                validators:{
                     identical:{
                        field:'in_passwd2',
                        message:'No coincide el password'
                    }
                }
            },
            in_passwd2:{
                validators:{
                     identical:{
                        field:'in_passwd1',
                        message:'no coincide el password'
                    }
                }
            }
        }
    }
};