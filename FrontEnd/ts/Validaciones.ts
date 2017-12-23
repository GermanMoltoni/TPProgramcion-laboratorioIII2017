function stopEvent(event:JQueryEventObject){
    event.preventDefault();
    event.stopImmediatePropagation();
}

var validator_nuevo_usuario = {
    id_form:"form_usuario",
    callback:()=>{
        Usuario.crear().done((e:any)=>{
            setTimeout(()=>{
                tabla_usuarios.reloadTable()},500);
        }); 
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
                setTimeout(()=>{
                    tabla_usuarios.reloadTable()},600);
            }); 
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
                Ajax.get('estacionamiento/listaCocheras').done((e)=>{
                    localStorage.setItem('lugares',JSON.stringify(e));
                    $("#id-autos").html(Estacionamiento.tablaCocheras(e));
                });
                
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
                            value = value.toUpperCase();
                            return (value.match(/^[A-Z]{3}[0-9]{3}/) != null || value.match(/^[A-Z]{2}[0-9]{3}[A-Z]{2}/) != null);
                        }
                    }
                }
            }
        }
    }
};
var validator_ingreso_vehiculo = {
    id_form:"form_ingreso_vehiculo",
    callback:()=>{
        $("#modal-ingreso-vehiculo").modal("hide");
        let auto = new Auto($("#in_dominio").val(),$("#in_marca").val(),$("#in_color").val(),$("#vehi_esp").is(":checked"));
        if(Estacionamiento.verificarLugares()){
            Estacionamiento.ingresar(auto).done((e)=>{
                $("#btn-eliminar-usr").addClass("hide_me"); 
                if(e.cochera != undefined)   {
                    $("#msg-info").text( 'Cochera Asignada:'+e.cochera);
                    Ajax.get('estacionamiento/listaCocheras').done((e)=>{
                        localStorage.setItem('lugares',JSON.stringify(e));
                        $("#id-autos").html(Estacionamiento.tablaCocheras(e));
                    });
                }            
                    
                else
                    $("#msg-info").text(e.error);
                $("#modal-info").modal("show");
            });
        }
        else{
            $("#msg-info").text('Capacidad Alcanzada');
            $("#modal-info").modal("show");
        }
        
    },
    opciones:{
        message: 'Este valor no es valido',
        fields: {
            in_dominio:{
                validators:{
                    callback:{
                        message:'Ingrese Dominio',
                        callback:(value:any)=>{
                            value = value.toUpperCase();
                             return (value.match(/^[A-Z]{3}[0-9]{3}/) != null || value.match(/^[A-Z]{2}[0-9]{3}[A-Z]{2}/) != null);
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




