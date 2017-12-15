/// <reference path="./types/jquery.d.ts" />
var Ajax = /** @class */ (function () {
    function Ajax() {
    }
    Ajax.get = function (path, data) {
        return $.ajax({
            url: Ajax.url + path,
            type: 'GET',
            dataType: 'json',
            data: data,
            async: true,
            headers: { 'token': Ajax.getToken() }
        });
    };
    Ajax.getPdf = function (path, data) {
        return $.ajax({
            url: Ajax.url + path,
            type: 'GET',
            data: data,
            async: true,
            headers: { 'token': Ajax.getToken() }
        });
    };
    Ajax.post = function (path, data) {
        return $.ajax({
            url: Ajax.url + path,
            type: 'POST',
            data: data,
            async: true,
            headers: { 'token': Ajax.getToken() }
        });
    };
    Ajax.postForm = function (path, data) {
        return $.ajax({
            url: Ajax.url + path,
            type: 'POST',
            contentType: false,
            processData: false,
            cache: false,
            data: data,
            async: true,
            headers: { 'token': Ajax.getToken() }
        });
    };
    Ajax.put = function (path, data) {
        return $.ajax({
            url: Ajax.url + path,
            type: 'PUT',
            dataType: 'json',
            data: data,
            async: true,
            headers: { 'token': Ajax.getToken() }
        });
    };
    Ajax["delete"] = function (path, data) {
        return $.ajax({
            url: Ajax.url + path,
            type: 'DELETE',
            dataType: 'json',
            data: data,
            async: true,
            headers: { 'token': Ajax.getToken() }
        });
    };
    Ajax.postArchivo = function (path, data) {
        var form_data = new FormData();
        for (var ind in data) {
            if (ind === 'file') {
                form_data.append('file', data[ind].files[0]);
            }
            else {
                form_data.append(ind, data[ind]);
            }
        }
        return $.ajax({
            url: Ajax.url + path,
            //  enctype: 'multipart/form-data',
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            async: true,
            headers: { 'token': Ajax.getToken() }
        });
    };
    Ajax.getToken = function () {
        var token = localStorage.getItem('token');
        if (token !== null)
            return token;
        //return null;
    };
    Ajax.setToken = function (data) {
        localStorage.setItem('token', data);
    };
    // private static url:string = 'http://localhost/TPProgramcion-laboratorioIII2017/Api/';
    Ajax.url = 'http://localhost:8080/prueba/TPProgramcion-laboratorioIII2017/Api/';
    return Ajax;
}());
/// <reference path="./types/jquery.d.ts" />
/// <reference path="./Ajax.ts" />
var Auth = /** @class */ (function () {
    function Auth(mail, password) {
        this.mail = mail;
        this.password = password;
    }
    Auth.setForm = function () {
        document.getElementById('mail').value = 'admin@admin';
        document.getElementById('password').value = '123';
    };
    Auth.clearForm = function () {
        document.getElementById('mail').value = '';
        document.getElementById('password').value = '';
    };
    Auth.prototype.login = function () {
        return Ajax.post('login', { mail: this.mail, password: this.password });
    };
    Auth.logout = function () {
        localStorage.clear();
        sessionStorage.clear();
        Auth.clearForm();
    };
    Auth.pagina = function (tipo) {
        if (tipo) {
            $("#form-login").prop("hidden", true);
            $("#ul-admin").removeClass("hide_me");
        }
        else {
            $("#form-login").prop("hidden", true);
            $("#ul-user").removeClass("hide_me");
            $("#estacionamiento").prop("hidden", false);
        }
        $("#ul-login").prop("hidden", true);
        $("#ul-logout").prop("hidden", false);
    };
    return Auth;
}());
var Auto = /** @class */ (function () {
    function Auto(patente, marca, color, especial) {
        this.marca = marca;
        this.color = color;
        this.patente = patente;
        this.especial = especial;
    }
    return Auto;
}());
/// <reference path="./types/jquery.d.ts" />
/// <reference path="./Ajax.ts" />
var Usuario = /** @class */ (function () {
    function Usuario(mail, nombre, apellido, password, estado, admin, turno, pathFoto, id, entrada, token) {
        this.id = id;
        this.mail = mail;
        this.nombre = nombre;
        this.apellido = apellido;
        this.password = password;
        this.estado = estado;
        this.turno = turno;
        this.admin = admin;
        this.entrada = entrada;
        this.pathFoto = pathFoto;
        this.token = token;
    }
    Usuario.crear = function () {
        return Ajax.postForm('usuario/alta', Usuario.getForm());
    };
    Usuario.modificar = function () {
        return Ajax.postForm('usuario/modificar', Usuario.getForm());
    };
    Usuario.listar = function (id) {
        return Ajax.get('usuario/listar', { id: id });
    };
    Usuario.setUsuario = function (usuario) {
        if (usuario != undefined)
            localStorage.setItem('usuario', JSON.stringify(usuario));
    };
    Usuario.getUsuario = function () {
        var datos = localStorage.getItem('usuario');
        if (datos != null) {
            var usuario = JSON.parse(datos);
            return Usuario.jsonToUsuario(usuario);
        }
        return null;
    };
    Usuario.jsonToUsuario = function (json) {
        if (json !== null) {
            return new Usuario(json.mail, json.nombre, json.apellido, json.password, json.estado, json.admin, json.turno, json.pathFoto, json.id);
        }
        return null;
    };
    Usuario.getForm = function () {
        var form = new FormData();
        form.append("nombre", $("#in_nombre").val());
        form.append("apellido", $("#in_apellido").val());
        form.append("password", $("#in_passwd1").val());
        form.append("mail", $("#in_mail").val());
        form.append("id", $("#in_id").val());
        form.append("turno", $("#sel_turno :selected").val());
        form.append("admin", $("#admin_usr").is(":checked") ? '1' : '0');
        form.append("estado", '1');
        var file = $("#file").prop("files")[0];
        if (file != undefined)
            form.append("file", file);
        return form;
    };
    Usuario.prototype.setForm = function () {
        $("#in_nombre").val(this.nombre);
        $("#in_apellido").val(this.apellido);
        $("#in_passwd1").val('');
        $("#in_id").val(this.id != undefined ? this.id.toString() : '');
        $("#in_mail").val(this.mail);
        $("#sel_turno").val(this.turno != undefined ? this.turno.toString() : '');
        if (this.admin != undefined && this.admin)
            $('#admin_usr').bootstrapToggle('on');
        else
            $('#admin_usr').bootstrapToggle('off');
        $("#pathFoto").val('');
    };
    Usuario.getTipo = function () {
        var usuario = Usuario.getUsuario();
        return usuario != null && (usuario.admin == '1');
    };
    Usuario.prototype.cambiarEstado = function () {
        return Ajax.put('usuario/estado', { id: this.id });
    };
    Usuario.vaciarFormFec = function () {
        $("#in_des_usr").val('');
        $("#in_has_usr").val('');
    };
    Usuario.getFechas = function () {
        return {
            id: 0,
            from: $("#in_des_usr").val(),
            to: $("#in_has_usr").val()
        };
    };
    return Usuario;
}());
/// <reference path="./Ajax.ts" />
var Operacion = /** @class */ (function () {
    function Operacion() {
    }
    Operacion.getForm = function () {
        return {
            id: $("#sel-usr").val(),
            from: $("#in_desde").val(),
            to: $("#in_hasta").val(),
            "export": ''
        };
    };
    Operacion.vaciarForm = function () {
        $("#in_desde").val('');
        $("#in_hasta").val('');
        $("#sel-usr").val('');
    };
    return Operacion;
}());
var Formato = /** @class */ (function () {
    function Formato() {
    }
    Formato.validator = function (obj_param) {
        var id_form = obj_param.id_form || null;
        var opciones = obj_param.opciones || null;
        var callback = obj_param.callback || null;
        if (opciones != null && id_form != null) {
            $("#" + id_form).bootstrapValidator('destroy');
            return $("#" + id_form).bootstrapValidator(opciones).
                on('success.form.bv', function (e) {
                if (typeof callback === 'function') {
                    callback();
                }
                e.preventDefault();
            });
        }
    };
    return Formato;
}());
var Estadistica = /** @class */ (function () {
    function Estadistica() {
    }
    Estadistica.getFormPeriodo = function () {
        return ($("#in_periodo").val()).split('-')[1] + '-' + ($("#in_periodo").val()).split('-')[0];
    };
    Estadistica.vaciarForm = function () {
        $("#in_desde_est").val('');
        $("#in_hasta_est").val('');
        $("#in_periodo").val('');
    };
    Estadistica.getFormFechas = function () {
        return {
            from: $("#in_desde_est").val(),
            to: $("#in_hasta_est").val()
        };
    };
    return Estadistica;
}());
var Estacionamiento = /** @class */ (function () {
    function Estacionamiento() {
    }
    Estacionamiento.ingresar = function (auto) {
        return Ajax.post('estacionamiento/ingreso', auto);
    };
    Estacionamiento.retirar = function () {
        return Ajax["delete"]('estacionamiento/egreso/' + encodeURI(Estacionamiento.getFormEgreso()));
    };
    Estacionamiento.setTicket = function (datos) {
        $("#lbl-dom-salida").text(datos.patente);
        $("#lbl-cochera-salida").text(datos.idCochera);
        $("#lbl-entrada-salida").text(datos.entrada);
        $("#lbl-salida-salida").text(datos.salida);
        $("#lbl-pago-salida").text(datos.pago);
        $("#lbl-tiempo-salida").text(datos.tiempo);
    };
    Estacionamiento.getFormEgreso = function () {
        return $("#in_dominio_egre").val();
    };
    Estacionamiento.verificarLugares = function () {
        var datos = localStorage.getItem('lugares');
        var lugares;
        var pisos;
        if (datos !== null) {
            lugares = JSON.parse(datos).ocupados;
            pisos = JSON.parse(datos).pisos;
            var cap_1 = 0;
            pisos.forEach(function (piso) {
                cap_1 += piso.cantidadCocheras + piso.cantidadReservados;
            });
            return lugares.length < cap_1;
        }
    };
    return Estacionamiento;
}());
//        $('#os_pac_des').DataTable().columns.adjust().draw();
var lenguage = {
    searchPlaceholder: "Filtrar",
    search: "_INPUT_",
    emptyTable: "Sin Datos",
    infoEmpty: "Sin Datos",
    zeroRecords: "No hay datos coincidentes",
    //loading: "<span ><img src='./info_vista/images/icon/spinner.gif'></span>",
    //processing: "<span ><img src='./info_vista/images/icon/spinner.gif'></span>",
    paginate: {
        previous: '<p style="color: black;">Anterior</p>',
        next: '<p style="color: black;">Siguiente</p>'
    },
    lengthMenu: "Ver _MENU_ registros",
    loadingRecords: 'Cargando...'
};
var DataTable = /** @class */ (function () {
    function DataTable(id_tabla, search) {
        this.url = 'http://localhost:8080/prueba/TPProgramcion-laboratorioIII2017/Api/';
        this.id_tabla = id_tabla;
        this.search = search != undefined ? search : true;
        this.iniciar();
    }
    DataTable.prototype.iniciar = function () {
        $('#' + this.id_tabla).DataTable().destroy();
        $("#" + this.id_tabla).DataTable({
            searching: false,
            paging: false,
            info: false,
            language: lenguage
        }).clear().draw();
    };
    DataTable.prototype.data = function (columns, data) {
        $('#' + this.id_tabla).DataTable().destroy();
        this.dt = $('#' + this.id_tabla).DataTable({
            autoWidth: false,
            destroy: true,
            data: data,
            info: false,
            select: true,
            searching: this.search,
            scroller: {
                loadingIndicator: true
            },
            paging: false,
            scrollY: 250,
            scrollX: true,
            scrollCollapse: true,
            columns: columns,
            language: lenguage,
            dom: '<"top"i>rt<"bottom"flp><"clear"><"toolbar">'
        });
    };
    DataTable.prototype.ajax = function (columns, path) {
        $('#' + this.id_tabla).DataTable().destroy();
        this.dt = $('#' + this.id_tabla).DataTable({
            autoWidth: false,
            destroy: true,
            ajax: { headers: { 'token': Ajax.getToken() },
                url: this.url + path,
                dataSrc: function (data) {
                    if (data == "{}" || data.error != undefined || data.msg != undefined)
                        return {};
                    return data;
                } },
            info: false,
            select: true,
            searching: this.search,
            scroller: {
                loadingIndicator: true
            },
            paging: false,
            scrollY: 250,
            scrollX: true,
            scrollCollapse: true,
            columns: columns,
            language: lenguage,
            dom: '<"top"i>rt<"bottom"flp><"clear"><"toolbar">'
        });
    };
    DataTable.prototype.reloadTable = function () {
        this.dt.ajax.reload();
    };
    DataTable.prototype.selectFila = function (fn_sel, fn_nosel) {
        var _this = this;
        if (fn_sel === void 0) { fn_sel = null; }
        if (fn_nosel === void 0) { fn_nosel = null; }
        var nombre_item = 'tr-' + this.id_tabla;
        sessionStorage.removeItem(nombre_item);
        $('#' + this.id_tabla + ' tbody').off('click', 'tr').on('click', 'tr', function (e, dt, type, indexes) {
            if ($(e.currentTarget).hasClass('selected')) {
                sessionStorage.removeItem(nombre_item);
                if (fn_nosel !== null)
                    fn_nosel();
            }
            else {
                var datos = _this.dt.row(e.currentTarget).data(); //cambiar
                sessionStorage.setItem(nombre_item, JSON.stringify(datos));
                if (fn_sel !== null)
                    fn_sel();
            }
        });
    };
    return DataTable;
}());
function stopEvent(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
}
function crearSelectUsr(id_div, arr_datos) {
    var div = document.getElementById(id_div);
    if (div === null) {
        return;
    }
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    var label = document.createElement('label');
    label.textContent = 'Usuario';
    var select = document.createElement('select');
    select.id = "sel-usr";
    select.name = "sel-usr";
    select.className = "form-control";
    var opcion = document.createElement('option');
    opcion.value = '0';
    opcion.text = 'Todos';
    select.appendChild(opcion);
    if (arr_datos !== null) {
        arr_datos.forEach(function (obj) {
            var opcion = document.createElement('option');
            opcion.value = obj.id;
            opcion.text = obj.nombre + ' ' + obj.apellido;
            select.appendChild(opcion);
        });
    }
    div.appendChild(label);
    div.appendChild(select);
}
var validator_nuevo_usuario = {
    id_form: "form_usuario",
    callback: function () {
        Usuario.crear().done(function (e) {
            setTimeout(function () {
                tabla_usuarios.reloadTable();
            }, 500);
        });
        $("#modal-nuevo-usuario").modal("hide");
    },
    opciones: {
        message: 'Este valor no es valido',
        fields: {
            in_nombre: {
                validators: {
                    notEmpty: { message: 'Ingrese Nombre' }
                }
            },
            in_apellido: {
                validators: {
                    notEmpty: { message: 'Ingrese Apellido' }
                }
            },
            sel_turno: {
                validators: {
                    callback: {
                        message: 'Ingresar Documento',
                        callback: function (value) {
                            if (!$("#admin_usr").is(":checked"))
                                return true;
                            else
                                return value > 0;
                        }
                    }
                }
            },
            in_mail: {
                validators: {
                    notEmpty: { message: 'Ingrese Mail' },
                    emailAddress: {
                        message: 'No es un mail válido'
                    }
                }
            },
            in_passwd1: {
                validators: {
                    notEmpty: { message: 'Ingrese Password' },
                    identical: {
                        field: 'in_passwd2',
                        message: 'No coincide el password'
                    }
                }
            },
            in_passwd2: {
                validators: {
                    notEmpty: { message: 'Verificar Password' },
                    identical: {
                        field: 'in_passwd1',
                        message: 'no coincide el password'
                    }
                }
            }
        }
    }
};
var validator_modificar_usuario = {
    id_form: "form_usuario",
    callback: function () {
        Usuario.modificar().done(function (e) {
            setTimeout(function () {
                tabla_usuarios.reloadTable();
            }, 500);
        }, function () { });
        $("#modal-nuevo-usuario").modal("hide");
    },
    opciones: {
        message: 'Este valor no es valido',
        fields: {
            in_nombre: {
                validators: {
                    notEmpty: { message: 'Ingrese Nombre' }
                }
            },
            in_apellido: {
                validators: {
                    notEmpty: { message: 'Ingrese Apellido' }
                }
            },
            sel_turno: {
                validators: {
                    callback: {
                        message: 'Ingresar Documento',
                        callback: function (value) {
                            if (!$("#admin_usr").is(":checked"))
                                return true;
                            else
                                return value > 0;
                        }
                    }
                }
            },
            in_mail: {
                validators: {
                    notEmpty: { message: 'Ingrese Mail' },
                    emailAddress: {
                        message: 'No es un mail válido'
                    }
                }
            },
            in_passwd1: {
                validators: {
                    identical: {
                        field: 'in_passwd2',
                        message: 'No coincide el password'
                    }
                }
            },
            in_passwd2: {
                validators: {
                    identical: {
                        field: 'in_passwd1',
                        message: 'no coincide el password'
                    }
                }
            }
        }
    }
};
var validator_egreso_vehiculo = {
    id_form: "form_egreso_vehiculo",
    callback: function () {
        $("#modal-egreso-vehiculo").modal("hide");
        Estacionamiento.retirar().done(function (e) {
            $("#btn-eliminar-usr").addClass("hide_me");
            if (e.error != undefined) {
                $("#msg-info").text(e.error);
                $("#modal-info").modal("show");
            }
            else {
                Estacionamiento.setTicket(e);
                $("#modal-tk-vehiculo").modal("show");
            }
        });
    },
    opciones: {
        message: 'Este valor no es valido',
        fields: {
            in_dominio_egre: {
                validators: {
                    callback: {
                        message: 'Ingrese Dominio',
                        callback: function (value) {
                        }
                    }
                }
            }
        }
    }
};
var validator_ingreso_vehiculo = {
    id_form: "form_ingreso_vehiculo",
    callback: function () {
        $("#modal-ingreso-vehiculo").modal("hide");
        var auto = new Auto($("#in_dominio").val(), $("#in_marca").val(), $("#in_color").val(), $("#vehi_esp").is(":checked"));
        if (Estacionamiento.verificarLugares()) {
            Estacionamiento.ingresar(auto).done(function (e) {
                $("#btn-eliminar-usr").addClass("hide_me");
                if (e.cochera != undefined)
                    $("#msg-info").text('Cochera Asignada:' + e.cochera);
                else
                    $("#msg-info").text(e.error);
                $("#modal-info").modal("show");
            });
        }
        else {
            $("#msg-info").text('Capacidad Alcanzada');
            $("#modal-info").modal("show");
        }
    },
    opciones: {
        message: 'Este valor no es valido',
        fields: {
            in_dominio: {
                validators: {
                    callback: {
                        message: 'Ingrese Dominio',
                        callback: function (value) {
                            value = value.toUpperCase();
                            return (value.match(/^[A-Z]{3}[0-9]{3}/) != null || value.match(/^[A-Z]{2}[0-9]{3}[A-Z]{2}/) != null);
                        }
                    }
                }
            },
            in_color: {
                validators: {
                    notEmpty: { message: 'Ingrese Mail' }
                }
            },
            in_marca: {
                validators: {
                    notEmpty: { message: 'Ingrese Mail' }
                }
            }
        }
    }
};
function tablaCocheras(array) {
    var table = '<div class="col-md-12">';
    var flag;
    var e;
    (array.pisos).forEach(function (piso) {
        for (var i = piso.idPiso * 100; i < (piso.idPiso * 100 + (piso.cantidadCocheras + piso.cantidadReservados)); i++) {
            for (var cell = 1; cell <= 12; cell++) {
                table += '<div class="row">';
                try {
                    (array.ocupados).forEach(function (auto) {
                        if (auto.idCochera == i) {
                            table += '<div class="col-md-1 col-sm-1"><div class="row"><a  data-toggle="popover" title="Nº' + auto.idCochera + '\nPatente:' + auto.patente + '\nColor: ' + auto.color + '\nMarca:' + auto.marca + '"><i style="margin:0px 0px 0px 60px;color:red;" class="material-icons "  >directions_car</i></a></div><div class="row"><p class="text-center"style="color:white;">' + auto.idCochera + '</p></div></div>';
                            flag = false;
                            throw e;
                        }
                        else
                            flag = true;
                    });
                }
                catch (e) { }
                if (flag)
                    table += '<div class="col-md-1 col-sm-1"><i class="material-icons" style="margin:0px 0px 0px 60px;color:green;"  >directions_car</i></div><div class="row"><p class="text-center"style="color:white;">' + i + '</p></div>';
                table += '</div>';
            }
        }
    });
    return table;
}
/*
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
*/ 
var tabla_est_fechas;
var tabla_est_mensual;
var tabla_usuarios;
var tabla_operaciones;
var tabla_oper_usr;
var tabla_log_usr;
var tabla_est_cochera;
$(document).ready(function () {
    var usr = Usuario.getUsuario();
    if (usr != null) {
        Auth.pagina(Usuario.getTipo());
    }
    /* Login y Logout */
    $("#a-login").click(function (e) {
        $("#form-login").prop("hidden", false);
        $("#usuarios").prop("hidden", true);
        $("#estacionamiento").prop("hidden", true);
        $("#estadistica").prop("hidden", true);
        $("#operaciones").prop("hidden", true);
        $("#logs-usuarios").prop("hidden", true);
        stopEvent(e);
    });
    $("#btn-login").click(function (e) {
        var login = new Auth($("#mail").val(), $("#password").val());
        login.login().done(function (e) {
            if (e.error != undefined) {
                $("#btn-eliminar-usr").addClass("hide_me");
                $("#msg-info").text(e.error);
                $("#modal-info").modal("show");
            }
            else {
                Usuario.setUsuario(e.user);
                Ajax.setToken(e.token);
                Auth.pagina(Usuario.getTipo());
            }
        });
        stopEvent(e);
    });
    $("#a-logout").click(function (e) {
        Auth.logout();
        $("#ul-login").prop("hidden", false);
        $("#ul-logout").prop("hidden", true);
        $("#ul-admin").addClass("hide_me");
        $("#ul-user").addClass("hide_me");
        $("#usuarios").prop("hidden", true);
        $("#estacionamiento").prop("hidden", true);
        $("#estadistica").prop("hidden", true);
        $("#operaciones").prop("hidden", true);
        $("#logs-usuarios").prop("hidden", true);
        stopEvent(e);
    });
    $("#btn-carga-login").click(function (e) {
        Auth.setForm();
        stopEvent(e);
    });
    /*Usuarios*/
    $("#a-usuarios-lis").click(function (e) {
        $("#form-login").prop("hidden", true);
        $("#usuarios").prop("hidden", false);
        $("#estacionamiento").prop("hidden", true);
        $("#estadistica").prop("hidden", true);
        $("#operaciones").prop("hidden", true);
        $("#logs-usuarios").prop("hidden", true);
        tabla_usuarios = new DataTable("tabla_usuarios");
        tabla_usuarios.ajax([
            { render: function (data, type, row) { return row.nombre + ',' + row.apellido; } },
            { render: function (data, type, row) {
                    var turno;
                    switch (row.turno) {
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
            { render: function (data, type, row) {
                    return row.estado == 1 ? '<span class="badge" style="background-color:green;">Habilitado</span>' : '<span class="badge" style="background-color:red;">Suspendido</span>';
                } },
            { render: function (data, type, row) {
                    return row.admin == 1 ? 'Administrador' : 'Empleado';
                } },
            { render: function (data, type, row) {
                    return row.pathFoto == null ? 'Sin Foto' : '<img height="50" src=../Api/foto?mail=' + row.mail + '>';
                }
            }
        ], 'usuario/listar');
        tabla_usuarios.selectFila();
        $(window).resize(function () {
            //   tabla_usuarios.dt.columns.adjust().draw();
        });
        stopEvent(e);
    });
    $("#btn-nuevo-usuario").click(function (e) {
        if (Usuario.getTipo()) {
            $('#admin_usr').bootstrapToggle('off');
            Formato.validator(validator_nuevo_usuario);
            $("#modal-nuevo-usuario").modal("show");
        }
        stopEvent(e);
    });
    $("#btn-modificar-usuario").click(function (e) {
        var datos = sessionStorage.getItem('tr-tabla_usuarios');
        var usuario = JSON.parse(datos !== null ? datos : '');
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
    $("#admin_usr").change(function () {
        if ($("#admin_usr").is(":checked"))
            $("#sel_turno").prop("disabled", true);
        else
            $("#sel_turno").prop("disabled", false);
        $("#form_usuario").bootstrapValidator('validateField', 'sel_turno');
    });
    $("#btn-estado-usuario").click(function (e) {
        var datos = sessionStorage.getItem('tr-tabla_usuarios');
        var usuario = JSON.parse(datos !== null ? datos : '');
        usuario = Usuario.jsonToUsuario(usuario);
        usuario.cambiarEstado().done(function (e) {
            tabla_usuarios.reloadTable();
        });
        stopEvent(e);
    });
    $("#btn-baja-usuario").click(function (e) {
        $("#msg-info").text("¿Desea borrar el usuario?");
        $("#btn-eliminar-usr").removeClass("hide_me");
        $("#modal-info").modal("show");
        stopEvent(e);
    });
    $("#btn-eliminar-usr").click(function (e) {
        var datos = sessionStorage.getItem('tr-tabla_usuarios');
        var usuario = JSON.parse(datos !== null ? datos : '');
        usuario = Usuario.jsonToUsuario(usuario);
        Ajax["delete"]('usuario/baja', { id: usuario.id }).done(function () {
            tabla_usuarios.reloadTable();
            $("#btn-eliminar-usr").addClass("hide_me");
            $("#modal-info").modal("hide");
        });
        stopEvent(e);
    });
    $("#a-logs-usuarios").click(function (e) {
        $("#form-login").prop("hidden", true);
        $("#usuarios").prop("hidden", true);
        $("#logs-usuarios").prop("hidden", false);
        $("#estacionamiento").prop("hidden", true);
        $("#estadistica").prop("hidden", true);
        $("#operaciones").prop("hidden", true);
        Usuario.vaciarFormFec();
        tabla_log_usr = new DataTable("tabla_log_usr", true);
        stopEvent(e);
    });
    $("#btn-bus-log-usr").click(function (e) {
        var fecha = Usuario.getFechas();
        tabla_log_usr.ajax([
            { render: function (data, type, row) { return row.nombre + ',' + row.apellido; } },
            { render: function (data, type, row) { return row.entrada; } },
            { render: function (data, type, row) {
                    return row.admin == 1 ? 'Administrador' : 'Empleado';
                } },
            { render: function (data, type, row) {
                    var turno;
                    switch (row.turno) {
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
        ], 'usuario/listarLogs?id=' + fecha.id + encodeURI('&from=' + fecha.from + '&to=' + fecha.to));
        stopEvent(e);
    });
    $('#in_des_usr').datetimepicker({
        format: 'YYYY-MM-DD'
    });
    $('#in_has_usr').datetimepicker({
        format: 'YYYY-MM-DD',
        useCurrent: false
    });
    $("#in_des_usr").on("dp.change", function (e) {
        $('#in_has_usr').data("DateTimePicker").minDate(e.date);
    });
    $("#in_has_usr").on("dp.change", function (e) {
        $('#in_des_usr').data("DateTimePicker").maxDate(e.date);
    });
    /* Estacionamiento */
    $("#a-estacionamiento").click(function (e) {
        $("#form-login").prop("hidden", true);
        $("#usuarios").prop("hidden", true);
        $("#operaciones").prop("hidden", true);
        $("#estadistica").prop("hidden", true);
        $("#estacionamiento").prop("hidden", false);
        $("#logs-usuarios").prop("hidden", true);
        Ajax.get('estacionamiento/listaCocheras').done(function (e) {
            localStorage.setItem('lugares', JSON.stringify(e));
            $("#id-autos").html(tablaCocheras(e));
        });
    });
    $("#btn-ingreso-auto").click(function (e) {
        $("#modal-ingreso-vehiculo").modal("show");
        $('#form_ingreso_vehiculo').bootstrapValidator('resetForm', true);
        Formato.validator(validator_ingreso_vehiculo);
        stopEvent(e);
    });
    $("#btn-egreso-auto").click(function (e) {
        $("#modal-egreso-vehiculo").modal("show");
        $('#form_egreso_vehiculo').bootstrapValidator('resetForm', true);
        Formato.validator(validator_egreso_vehiculo);
        stopEvent(e);
    });
    /* Operaciones */
    $("#a-operaciones").click(function (e) {
        $("#logs-usuarios").prop("hidden", true);
        $("#form-login").prop("hidden", true);
        $("#usuarios").prop("hidden", true);
        $("#estacionamiento").prop("hidden", true);
        $("#operaciones").prop("hidden", false);
        $("#estadistica").prop("hidden", true);
        Operacion.vaciarForm();
        tabla_operaciones = new DataTable("tabla_operaciones");
        tabla_oper_usr = new DataTable("tabla_oper_usr", false);
        Usuario.listar().done(function (datos) {
            crearSelectUsr('lista_usuarios', datos);
        });
        $("#operaciones").prop("hidden", false);
    });
    $("#btn-buscar-oper").click(function (e) {
        var datos = Operacion.getForm();
        tabla_operaciones.ajax([
            { data: 'idCochera' },
            { data: 'patente' },
            { data: 'entrada' },
            { data: 'salida' },
            { data: 'tiempo' },
            { data: 'pago' },
            { data: 'idUser' },
        ], 'operaciones/listar?id=' + datos.id + encodeURI('&from=' + datos.from + '&to=' + datos.to));
        tabla_oper_usr.ajax([
            { data: 'idUser' },
            { data: 'cantidad' },
        ], 'operaciones/operacionesUsuarios?id=' + datos.id + encodeURI('&from=' + datos.from + '&to=' + datos.to));
        stopEvent(e);
    });
    $('#in_desde').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss'
    });
    $('#in_hasta').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        useCurrent: false
    });
    $("#in_desde").on("dp.change", function (e) {
        $('#in_hasta').data("DateTimePicker").minDate(e.date);
    });
    $("#in_hasta").on("dp.change", function (e) {
        $('#in_desde').data("DateTimePicker").maxDate(e.date);
    });
    $("#btn-exporta-csv").click(function (e) {
        var datos = Operacion.getForm();
        datos["export"] = 'excel';
        Ajax.getPdf('operaciones/listar', datos).done(function (res) {
            var win = window.open();
            if (win !== null)
                win.document.body.innerHTML = "<iframe src='" + res.pdf + "' width='100%' height='100%'><a href='" + res.pdf + "'>Download PDF</a> </iframe>";
        });
        stopEvent(e);
    });
    $("#btn-exporta-pdf").click(function (e) {
        var datos = Operacion.getForm();
        datos["export"] = 'pdf';
        Ajax.getPdf('operaciones/listar', datos).done(function (res) {
            var win = window.open();
            if (win !== null)
                win.document.body.innerHTML = "<iframe src='" + res.pdf + "' width='100%' height='100%'><a href='" + res.pdf + "'>Download PDF</a> </iframe>";
        });
        stopEvent(e);
    });
    /* Estadisticas */
    $("#a-estadistica").click(function (e) {
        $("#form-login").prop("hidden", true);
        $("#usuarios").prop("hidden", true);
        $("#estacionamiento").prop("hidden", true);
        $("#operaciones").prop("hidden", true);
        $("#logs-usuarios").prop("hidden", true);
        Estadistica.vaciarForm();
        tabla_est_fechas = new DataTable("tabla_est_fechas", false);
        tabla_est_mensual = new DataTable("tabla_est_mensual", true);
        tabla_est_cochera = new DataTable("tabla_est_cochera", false);
        $("#estadistica").prop("hidden", false);
        stopEvent(e);
    });
    $("#btn-bus-mensual").click(function (e) {
        var datos = Estadistica.getFormPeriodo();
        tabla_est_mensual.ajax([
            { data: 'idUser' },
            { data: 'promedio' },
        ], 'estadistica/promediousuariomensual?' + encodeURI('periodo=' + datos));
        Ajax.get('estadistica/promediofacturacionmensual?' + encodeURI('periodo=' + datos)).done(function (res) {
            if (res.msg == undefined) {
                $("#lbl-factu-mensual").text(res);
            }
        });
        Ajax.get('estadistica/promedioautosmensual?' + encodeURI('periodo=' + datos)).done(function (res) {
            if (res.msg == undefined) {
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
    $("#in_desde_est").on("dp.change", function (e) {
        $('#in_hasta_est').data("DateTimePicker").minDate(e.date);
    });
    $("#in_hasta_est").on("dp.change", function (e) {
        $('#in_desde_est').data("DateTimePicker").maxDate(e.date);
    });
    $("#btn-bus-est").click(function (e) {
        var datos = Estadistica.getFormFechas();
        Ajax.get('estadistica/facturacion?' + encodeURI('&from=' + datos.from + '&to=' + datos.to)).done(function (res) {
            if (res.msg == undefined) {
                $("#lbl-factu-periodo").text(res[0].facturacion);
                $("#lbl-autos-periodo").text(res[0].cantidad_autos);
            }
        });
        Ajax.get('estadistica/vehiculos?' + encodeURI('&from=' + datos.from + '&to=' + datos.to)).done(function (res) {
            if (res.msg == undefined) {
                $("#lbl-factu").text(res.distintos);
                tabla_est_fechas.data([
                    { render: function (data, type, row) {
                            return row.patente;
                        } },
                    { render: function (data, type, row) {
                            return row.cantidad;
                        } },
                ], res.repetidos);
            }
        });
        Ajax.get('estadistica/usococheras?' + encodeURI('&from=' + datos.from + '&to=' + datos.to)).done(function (res) {
            if (res.msg == undefined) {
                var cocheras_1 = new Array();
                res.especial.forEach(function (element) {
                    element.tipo = 'especial';
                    cocheras_1.push(element);
                });
                res.comun.forEach(function (element) {
                    element.tipo = 'otro';
                    cocheras_1.push(element);
                });
                tabla_est_cochera.data([
                    { render: function (data, type, row) {
                            return row.cochera;
                        } },
                    { render: function (data, type, row) {
                            return row.cantidad;
                        } },
                ], cocheras_1);
            }
        });
        stopEvent(e);
    });
});
