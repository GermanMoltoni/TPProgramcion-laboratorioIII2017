function stopEvent(event:JQueryEventObject){
    event.preventDefault();
    event.stopImmediatePropagation();
}
function crearSelectUsr(id_div:any,arr_datos:any){
    let div = document.getElementById(id_div);
    if(div === null){
        return;
    }
    while (div.firstChild){
        div.removeChild(div.firstChild);
    }
    let label = document.createElement('label');
    label.textContent = 'Usuario';
    let select = document.createElement('select');
    select.id="sel-usr";
    select.name="sel-usr";
    select.className = "form-control"
    let opcion = document.createElement('option');
    opcion.value = '0';
    opcion.text = 'Todos';
    select.appendChild(opcion);
    if(arr_datos !== null){
        arr_datos.forEach(function(obj:any){
            let opcion = document.createElement('option');
            opcion.value = obj.id;
            opcion.text = obj.nombre+' '+obj.apellido;
            select.appendChild(opcion);
        });
    }
    div.appendChild(label);
    
    div.appendChild(select);
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
                    tabla_usuarios.reloadTable()},500);
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
var validator_ingreso_vehiculo = {
    id_form:"form_ingreso_vehiculo",
    callback:()=>{
        $("#modal-ingreso-vehiculo").modal("hide");
        let auto = new Auto($("#in_dominio").val(),$("#in_marca").val(),$("#in_color").val(),$("#vehi_esp").is(":checked"));
        if(Estacionamiento.verificarLugares()){
            Estacionamiento.ingresar(auto).done((e)=>{
                $("#btn-eliminar-usr").addClass("hide_me"); 
                if(e.cochera != undefined)               
                    $("#msg-info").text( 'Cochera Asignada:'+e.cochera);
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
                    notEmpty:{message:'Ingrese Mail'},
                    
                }
            },
            in_marca:{
                validators:{
                    notEmpty:{message:'Ingrese Mail'},
                    
                }
            },
        }
    }
};



function tablaCocheras(array:any){
    var table='<table id="tablaCocheras" class="table table-condensed"><tbody>';
    var flag:boolean;
    var e:any;
    (array.pisos).forEach(function(piso:any){
        table+='<tr>';
        for(var i=piso.idPiso*100;i<(piso.idPiso*100+(piso.cantidadCocheras+piso.cantidadReservados));i++)
        {  
            try{
                (array.ocupados).forEach(function(auto:any)
                {
                    if(auto.idCochera == i)
                    {
                            table+='<td id='+i+'  style="   width:60px; height:60px;"><div class="row"><a  data-toggle="popover" title="Nº'+auto.idCochera+ '\nPatente:'+auto.patente+'\nColor: '+auto.color+'\nMarca:'+auto.marca+'"><i style="margin:0px 0px 0px 60px;color:red;" class="material-icons "  >directions_car</i></a></div><div class="row"><p class="text-center"style="color:white;">'+auto.idCochera+'</p></div> </td>';
                            flag = false;
                            throw e;
                            
                    }
                    else
                        flag = true;
                });
            }
            catch(e){}
            if(flag)
                table+='<td id='+i+' style="width:60px; height:60px;"><div class="row"><i class="material-icons" style="margin:0px 0px 0px 60px;color:green;"  >directions_car</i></div><div class="row"><p class="text-center"style="color:white;">'+i+'</p></div></td>';
        }
        table+='</tr>';
    });
    table+='</tr></tbody></table>';
    return table;
}