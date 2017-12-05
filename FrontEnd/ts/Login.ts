$(document).ready(()=>{
    $("#a-login").click((e)=>{
        $("#form-login").removeAttr("hidden");
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#btn-login").click((e)=>{
        let login = new Auth($("#mail").val(),$("#password").val());
        login.login().done((e:any)=>{
            Usuario.setUsuario(e.user);
            if(e.error != undefined){
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
        $("#modal-nuevo-usuario").modal("show");
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $('#admin-usr').bootstrapToggle({
        on: 'Si',
        off: 'No'
      });
}
);
function ValidadorForm(obj_param){
    var id_form = obj_param.id_form || null;
    var opciones = obj_param.opciones || null;
    let callback = obj_param.callback || null;
    if(opciones != null && id_form != null){
        $("#"+id_form).bootstrapValidator('destroy');  
        return $("#"+id_form).bootstrapValidator(opciones).
        on('success.form.bv',(e)=>{
            e.preventDefault();
            if(typeof callback === 'function'){
                callback();
            }
        });
    }
}