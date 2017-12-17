var tabla_est_fechas:DataTable;
var tabla_est_mensual:DataTable;
var tabla_usuarios:DataTable;
var tabla_operaciones:DataTable;
var tabla_oper_usr:DataTable;
var tabla_log_usr:DataTable;
var tabla_est_cochera:DataTable;
$(document).ready(()=>{

    let usr = Usuario.getUsuario();
    if(usr != null){
        Auth.pagina(Usuario.getTipo());
    }
    /* Login y Logout */
    $("#a-login").click((e)=>{
        $("#form-login").prop("hidden",false);
        $("#usuarios").prop("hidden",true);
        $("#estacionamiento").prop("hidden",true);
        $("#estadistica").prop("hidden",true);
        $("#operaciones").prop("hidden",true);
        $("#logs-usuarios").prop("hidden",true);
        $("#lugares").prop("hidden",true);
        
        stopEvent(e);
    });
    $("#btn-login").click((e)=>{
        let login = new Auth($("#mail").val(),$("#password").val());
        login.login().done((e:any)=>{
            if(e.error != undefined){
                $("#btn-eliminar-usr").addClass("hide_me");                
                $("#msg-info").text(e.error);
                $("#modal-info").modal("show");
            }
            else{
                Usuario.setUsuario(e.user);
                Ajax.setToken(e.token);
                Auth.pagina(Usuario.getTipo());
                
            }
        }); 
        stopEvent(e);
    });
    $("#a-logout").click((e)=>{
        Auth.logout();
        $("#ul-login").prop("hidden",false);
        $("#ul-logout").prop("hidden",true);
        $("#ul-admin").addClass("hide_me");
        $("#ul-user").addClass("hide_me");
        $("#usuarios").prop("hidden",true);
        $("#estacionamiento").prop("hidden",true);
        $("#estadistica").prop("hidden",true);
        $("#operaciones").prop("hidden",true);
        $("#logs-usuarios").prop("hidden",true);
        
        stopEvent(e);
    });
    $("#btn-carga-login").click((e)=>{
        Auth.setForm();
        stopEvent(e);
    });

    /*Usuarios*/
    $("#a-usuarios-lis").click((e)=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",false);
        $("#estacionamiento").prop("hidden",true);
        $("#estadistica").prop("hidden",true);
        $("#operaciones").prop("hidden",true);
        $("#lugares").prop("hidden",true);
        
        $("#logs-usuarios").prop("hidden",true);
        
        tabla_usuarios = new DataTable("tabla_usuarios");
        tabla_usuarios.ajax([                
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
                }
            },
            {render:function(data:any,type:any,row:any){
                return row.estado == 1?'<span class="badge" style="background-color:green;">Habilitado</span>':'<span class="badge" style="background-color:red;">Suspendido</span>';}},   
            {render:function(data:any,type:any,row:any){
                return row.admin == 1?'Administrador':'Empleado';}},
            {render:function(data:any,type:any,row:any){
                return row.pathFoto == null?'Sin Foto':'<img height="50" src=../Api/foto?mail='+row.mail+'>';}
            }
        ],'usuario/listar');
        tabla_usuarios.selectFila();
    
        stopEvent(e);
    });
    $("#btn-nuevo-usuario").click((e)=>{
        if(Usuario.getTipo()){
            $('#admin_usr').bootstrapToggle('off');
            Formato.validator(validator_nuevo_usuario);
            $("#modal-nuevo-usuario").modal("show");
        }
        stopEvent(e);
    });
    $("#btn-modificar-usuario").click((e)=>{
        let datos = sessionStorage.getItem('tr-tabla_usuarios');
        let usuario = JSON.parse(datos !== null?datos:'');
        usuario = Usuario.jsonToUsuario(usuario);
        usuario.setForm();
        Formato.validator(validator_modificar_usuario);
        $("#modal-nuevo-usuario").modal("show");
        stopEvent(e);
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
        });
        stopEvent(e);
    });
    $("#btn-baja-usuario").click((e)=>{
        $("#msg-info").text("¿Desea borrar el usuario?");
        $("#btn-eliminar-usr").removeClass("hide_me");
        $("#modal-info").modal("show");
        stopEvent(e);
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
        stopEvent(e);
    });

    $("#a-logs-usuarios").click((e)=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",true);
        $("#logs-usuarios").prop("hidden",false);
        $("#estacionamiento").prop("hidden",true);
        $("#estadistica").prop("hidden",true);
        $("#lugares").prop("hidden",true);
        
        $("#operaciones").prop("hidden",true);
        Usuario.vaciarFormFec();
        tabla_log_usr = new DataTable("tabla_log_usr",true);
        stopEvent(e);
    });

    $("#btn-bus-log-usr").click((e)=>{
        let fecha = Usuario.getFechas();
        tabla_log_usr.ajax([                
            {render:function(data:any,type:any,row:any){return row.nombre+','+row.apellido;}},
            {render:function(data:any,type:any,row:any){return row.entrada;}},
            {render:function(data:any,type:any,row:any){
                return row.admin == 1?'Administrador':'Empleado';}},
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
                }
            },
        ],'usuario/listarLogs?id='+fecha.id+encodeURI('&from='+fecha.from+'&to='+fecha.to));
        stopEvent(e);
    });
    $('#in_des_usr').datetimepicker({
        format: 'YYYY-MM-DD'
    });
    $('#in_has_usr').datetimepicker({
        format: 'YYYY-MM-DD',
        useCurrent: false
    });
    $("#in_des_usr").on("dp.change", function (e:any) {
        $('#in_has_usr').data("DateTimePicker").minDate(e.date);
    });
    $("#in_has_usr").on("dp.change", function (e:any) {
        $('#in_des_usr').data("DateTimePicker").maxDate(e.date);
    });

    /* Estacionamiento */
    $("#a-estacionamiento").click((e)=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",true);
        $("#lugares").prop("hidden",true);
        
        $("#operaciones").prop("hidden",true);
        $("#estadistica").prop("hidden",true);
        $("#estacionamiento").prop("hidden",false);
        $("#logs-usuarios").prop("hidden",true);
        Ajax.get('estacionamiento/listaCocheras').done((e)=>{
            localStorage.setItem('lugares',JSON.stringify(e));
            $("#id-autos").html(tablaCocheras(e));
        });
    });
    $("#btn-ingreso-auto").click((e)=>{
        $("#modal-ingreso-vehiculo").modal("show");
        $('#form_ingreso_vehiculo').bootstrapValidator('resetForm', true);
        Formato.validator(validator_ingreso_vehiculo);
        stopEvent(e);
    });
    $("#btn-egreso-auto").click((e)=>{
        $("#modal-egreso-vehiculo").modal("show");
        $('#form_egreso_vehiculo').bootstrapValidator('resetForm', true);
        Formato.validator(validator_egreso_vehiculo);
        stopEvent(e);
    });
    /* Operaciones */
    $("#a-operaciones").click((e)=>{
        $("#logs-usuarios").prop("hidden",true);
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",true);
        $("#estacionamiento").prop("hidden",true);
        $("#operaciones").prop("hidden",false);
        $("#estadistica").prop("hidden",true);
        Operacion.vaciarForm();
        tabla_operaciones = new DataTable("tabla_operaciones");
        tabla_oper_usr = new DataTable("tabla_oper_usr",false);

        Usuario.listar().done((datos)=>{
            crearSelectUsr('lista_usuarios',datos);
        });
        $("#operaciones").prop("hidden",false);
    });
    $("#btn-buscar-oper").click((e)=>{
        let datos = Operacion.getForm()
        tabla_operaciones.ajax([                
            {data:'idCochera'},
            {data:'patente'},
            {data:'entrada'},
            {data:'salida'},
            {data:'tiempo'},
            {data:'pago'},
            {data:'idUser'},
        ],'operaciones/listar?id='+datos.id+encodeURI('&from='+datos.from+'&to='+datos.to));
        tabla_oper_usr.ajax([                
            {data:'idUser'},
            {data:'cantidad'},
        ],'operaciones/operacionesUsuarios?id='+datos.id+encodeURI('&from='+datos.from+'&to='+datos.to));
        stopEvent(e);
    });
    $('#in_desde').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss'
    });
    $('#in_hasta').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        useCurrent: false
    });
    $("#in_desde").on("dp.change", function (e:any) {
        $('#in_hasta').data("DateTimePicker").minDate(e.date);
    });
    $("#in_hasta").on("dp.change", function (e:any) {
        $('#in_desde').data("DateTimePicker").maxDate(e.date);
    });
    $("#btn-exporta-csv").click((e)=>{
        let datos = Operacion.getForm();
        datos.export = 'excel';
        Ajax.getPdf('operaciones/listar',datos).done((res)=>{
            let win = window.open();
            if(win !== null)
                win.document.body.innerHTML = "<iframe src='"+res.pdf+"' width='100%' height='100%'><a href='"+res.pdf+"'>Download PDF</a> </iframe>";
        });
        stopEvent(e);
    });
    $("#btn-exporta-pdf").click((e)=>{
        let datos = Operacion.getForm();
        datos.export = 'pdf';
        Ajax.getPdf('operaciones/listar',datos).done((res)=>{
            let win = window.open();
            if(win !== null)
                win.document.body.innerHTML = "<iframe src='"+res.pdf+"' width='100%' height='100%'><a href='"+res.pdf+"'>Download PDF</a> </iframe>";
            
        });
        stopEvent(e);
    });
    /* Estadisticas */
    $("#a-estadistica").click((e)=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",true);
        $("#lugares").prop("hidden",true);
        
        $("#estacionamiento").prop("hidden",true);
        $("#operaciones").prop("hidden",true);
        $("#logs-usuarios").prop("hidden",true);
        Estadistica.vaciarForm();
        tabla_est_fechas = new DataTable("tabla_est_fechas",false);
        tabla_est_mensual = new DataTable("tabla_est_mensual",true);
        tabla_est_cochera = new DataTable("tabla_est_cochera",false);
        $("#estadistica").prop("hidden",false);
        stopEvent(e);
    });
    $("#btn-bus-mensual").click((e)=>{
        let datos = Estadistica.getFormPeriodo();
        tabla_est_mensual.ajax([                
            {data:'idUser'},
            {data:'promedio'},
        ],'estadistica/promediousuariomensual?'+encodeURI('periodo='+datos));
        Ajax.get('estadistica/promediofacturacionmensual?'+encodeURI('periodo='+datos)).done((res)=>{
            if(res.msg == undefined){
                $("#lbl-factu-mensual").text(res);
            }
        });
        Ajax.get('estadistica/promedioautosmensual?'+encodeURI('periodo='+datos)).done((res)=>{
            if(res.msg == undefined){
                $("#lbl-autos-mensual").text(res);
            }
        });
        stopEvent(e);
    });
    $('#in_hasta_est').datetimepicker({
        format: 'YYYY-MM-DD',
        useCurrent: false
    });
    $('#in_desde_est').datetimepicker({
        format: 'YYYY-MM-DD'
    });
    $('#in_periodo').datetimepicker({
        format: 'MM-YYYY',
        useCurrent: false
    });
    $("#in_desde_est").on("dp.change", function (e:any) {
        $('#in_hasta_est').data("DateTimePicker").minDate(e.date);
    });
    $("#in_hasta_est").on("dp.change", function (e:any) {
        $('#in_desde_est').data("DateTimePicker").maxDate(e.date);
    });
    $("#btn-bus-est").click((e)=>{
        let datos = Estadistica.getFormFechas()
        Ajax.get('estadistica/facturacion?'+encodeURI('&from='+datos.from+'&to='+datos.to)).done((res)=>{
            if(res.msg == undefined){
                $("#lbl-factu-periodo").text(res[0].facturacion);
                $("#lbl-autos-periodo").text(res[0].cantidad_autos);
            }
        });
        Ajax.get('estadistica/vehiculos?'+encodeURI('&from='+datos.from+'&to='+datos.to)).done((res)=>{
            if(res.msg == undefined){
                $("#lbl-factu").text(res.distintos);
                
                tabla_est_fechas.data([                
                    {render:function(data:any,type:any,row:any){
                        
                        return  row.patente;}},
                    {render:function(data:any,type:any,row:any){
                        return  row.cantidad;}},
                    
                ],res.repetidos);
              
            }
        });
        Ajax.get('estadistica/usococheras?'+encodeURI('&from='+datos.from+'&to='+datos.to)).done((res)=>{
            if(res.msg == undefined){
                let cocheras:any[] =new Array<any>();
                res.especial.forEach((element:any) => {
                    element.tipo = 'especial';
                    cocheras.push(element);
                });  
                res.comun.forEach((element:any) => {
                    element.tipo = 'otro';
                    cocheras.push(element);
                });      
                 tabla_est_cochera.data([                
                    {render:function(data:any,type:any,row:any){
                        
                        return  row.cochera;}},
                    {render:function(data:any,type:any,row:any){
                        return  row.cantidad;}},
                    
                ],cocheras);
              
            }
        });
     
        stopEvent(e);
    });

    /* Lugares utilizados */
    $("#a-lugares").click(()=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",true);
        $("#lugares").prop("hidden",false);
        $("#operaciones").prop("hidden",true);
        $("#estadistica").prop("hidden",true);
        $("#estacionamiento").prop("hidden",true);
        $("#logs-usuarios").prop("hidden",true);
        var tabla_mas = new DataTable('tabla_mas_u',false);
        var tabla_menos = new DataTable('tabla_menos_u',false);
        var tabla_nunca = new DataTable('tabla_nunca_u',false);
        tabla_mas.ajax([                
            {data:'cochera'},
            {data:'veces'},
        ],'estacionamiento/lugares/masUtilizado');
        tabla_menos.ajax([                
            {data:'cochera'},
            {data:'veces'},
        ],'estacionamiento/lugares/menosUtilizado');
        tabla_nunca.ajax([                
            {render:function(data:any,type:any,row:any){
                 
                return row;}
            }
        ],'estacionamiento/lugares/nuncaUtilizado');
    });
    
});

