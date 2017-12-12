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
    Ajax.post = function (path, data) {
        return $.ajax({
            url: Ajax.url + path,
            type: 'POST',
            dataType: 'json',
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
    Ajax.url = 'http://localhost/TPProgramcion-laboratorioIII2017/Api/';
    return Ajax;
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
        return Ajax.post('usuario/alta', Usuario.getForm());
    };
    Usuario.modificar = function () {
        return Ajax.post('usuario/modificar', Usuario.getForm());
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
        var usuario = JSON.parse(datos !== null ? datos : '');
        if (usuario !== null) {
            return new Usuario(usuario.mail, usuario.nombre, usuario.apellido, usuario.password, usuario.estado, usuario.admin, usuario.turno, usuario.pathFoto, usuario.id);
        }
    };
    Usuario.jsonToUsuario = function (json) {
        if (json !== null) {
            return new Usuario(json.mail, json.nombre, json.apellido, json.password, json.estado, json.admin, json.turno, json.pathFoto, json.id);
        }
    };
    Usuario.getForm = function () {
        return {
            "nombre": $("#in_nombre").val(),
            "apellido": $("#in_apellido").val(),
            "password": $("#in_passwd1").val(),
            "mail": $("#in_mail").val(),
            "id": $("#in_id").val(),
            "turno": $("#sel_turno :selected").val(),
            "admin": $("#admin_usr").is(":checked") ? '1' : '0',
            "estado": "1"
        };
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
        return usuario != undefined && usuario.admin;
    };
    Usuario.prototype.cambiarEstado = function () {
        return Ajax.put('usuario/estado', { id: this.id });
    };
    return Usuario;
}());
var tabla_usuarios;
$(document).ready(function () {
    $("#a-login").click(function (e) {
        $("#form-login").removeAttr("hidden");
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#btn-login").click(function (e) {
        var login = new Auth($("#mail").val(), $("#password").val());
        login.login().done(function (e) {
            console.log(e);
            Usuario.setUsuario(e.user);
            Ajax.setToken(e.token);
            if (e.error != undefined) {
                $("#btn-eliminar-usr").addClass("hide_me");
                $("#msg-info").text(e.error);
                $("#modal-info").modal("show");
            }
            else {
                if (Usuario.getTipo()) {
                    $("#form-login").prop("hidden", true);
                    $("#ul-admin").removeClass("hide_me");
                }
                else {
                    $("#form-login").prop("hidden", true);
                    $("#ul-user").removeClass("hide_me");
                }
                $("#ul-login").prop("hidden", true);
                $("#ul-logout").prop("hidden", false);
            }
        }, function () { });
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#a-logout").click(function (e) {
        Auth.logout();
        $("#ul-login").prop("hidden", false);
        $("#ul-logout").prop("hidden", true);
        $("#ul-admin").addClass("hide_me");
        $("#ul-user").addClass("hide_me");
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#btn-carga-login").click(function (e) {
        Auth.setForm();
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#btn-nuevo-usuario").click(function (e) {
        $('#admin_usr').bootstrapToggle('off');
        $('#form_usuario').bootstrapValidator('resetForm', true);
        ValidadorForm(validator_nuevo_usuario);
        $("#modal-nuevo-usuario").modal("show");
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#btn-modificar-usuario").click(function (e) {
        var datos = sessionStorage.getItem('tr-tabla_usuarios');
        var usuario = JSON.parse(datos !== null ? datos : '');
        usuario = Usuario.jsonToUsuario(usuario);
        usuario.setForm();
        ValidadorForm(validator_modificar_usuario);
        $("#modal-nuevo-usuario").modal("show");
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#a-usuarios-lis").click(function (e) {
        $("#form-login").prop("hidden", true);
        $("#usuarios").prop("hidden", false);
        $("#estacionamiento").prop("hidden", true);
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
                } },
            { render: function (data, type, row) {
                    return row.estado == 1 ? '<span class="badge" style="background-color:green;">Habilitado</span>' : '<span class="badge" style="background-color:red;">Suspendido</span>';
                } },
            { render: function (data, type, row) {
                    return row.admin == 1 ? 'Administrador' : 'Empleado';
                } },
            { render: function (data, type, row) {
                    return row.pathFoto == null ? 'Sin Foto' : '<img src=' + row.pathFoto + '>';
                } },
        ]);
        tabla_usuarios.setPath('http://localhost/TPProgramcion-laboratorioIII2017/Api/usuario/listar');
        tabla_usuarios.selectFila();
        e.preventDefault();
        e.stopImmediatePropagation();
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
        }, function () { });
        e.preventDefault();
    });
    $("#btn-baja-usuario").click(function (e) {
        $("#msg-info").text("¿Desea borrar el usuario?");
        $("#btn-eliminar-usr").removeClass("hide_me");
        $("#modal-info").modal("show");
        e.preventDefault();
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
        e.preventDefault();
    });
});
function ValidadorForm(obj_param) {
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
}
var validator_nuevo_usuario = {
    id_form: "form_usuario",
    callback: function () {
        Usuario.crear().done(function (e) {
            tabla_usuarios.reloadTable();
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
            tabla_usuarios.reloadTable();
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
/// <reference path="./types/jquery.d.ts" />
/// <reference path="./Ajax.ts" />
var Auth = /** @class */ (function () {
    function Auth(mail, password) {
        this.mail = mail;
        this.password = password;
    }
    Auth.setForm = function () {
        $("#mail").val('admin@admin');
        $("#password").val('123');
    };
    Auth.prototype.login = function () {
        return Ajax.post('login', { mail: this.mail, password: this.password });
    };
    Auth.logout = function () {
        localStorage.clear();
        sessionStorage.clear();
    };
    return Auth;
}());
var DataTable = /** @class */ (function () {
    function DataTable(id_tabla) {
        this.id_tabla = id_tabla;
    }
    DataTable.prototype.setPath = function (path) {
        this.path = path;
    };
    DataTable.prototype.ajax = function (columns) {
        $('#' + this.id_tabla).DataTable().destroy();
        this.dt = $('#' + this.id_tabla).DataTable({
            autoWidth: false,
            destroy: true,
            ajax: { url: this.path,
                dataSrc: function (data) {
                    if (data == "{}")
                        return {};
                    return data;
                } },
            info: false,
            select: true,
            searching: true,
            scroller: {
                loadingIndicator: true
            },
            paging: false,
            scrollY: 400,
            scrollX: true,
            scrollCollapse: true,
            columns: columns,
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
$(document).ready(function () {
    $("#a-estacionamiento").click(function (e) {
        $("#form-login").prop("hidden", true);
        $("#usuarios").prop("hidden", true);
        $("#operaciones").prop("hidden", true);
        $("#estacionamiento").prop("hidden", false);
    });
    $("#btn-ingreso-auto").click(function (e) {
        $("#modal-ingreso-vehiculo").modal("show");
        $('#form_ingreso_vehiculo').bootstrapValidator('resetForm', true);
        ValidadorForm(validator_ingreso_vehiculo);
        e.preventDefault();
    });
    $("#btn-egreso-auto").click(function (e) {
        $("#modal-egreso-vehiculo").modal("show");
        $('#form_egreso_vehiculo').bootstrapValidator('resetForm', true);
        ValidadorForm(validator_egreso_vehiculo);
        e.preventDefault();
    });
});
var validator_ingreso_vehiculo = {
    id_form: "form_ingreso_vehiculo",
    callback: function () {
        $("#modal-ingreso-vehiculo").modal("hide");
        Estacionamiento.ingresar().done(function (e) {
            $("#btn-eliminar-usr").addClass("hide_me");
            if (e.cochera != undefined)
                $("#msg-info").text('Cochera Asignada:' + e.cochera);
            else
                $("#msg-info").text(e.error);
            $("#modal-info").modal("show");
        });
    },
    opciones: {
        message: 'Este valor no es valido',
        fields: {
            in_dominio: {
                validators: {
                    callback: {
                        message: 'Ingrese Dominio',
                        callback: function (value) {
                        }
                    }
                }
            },
            in_color: {
                validators: {
                    notEmpty: { message: 'Ingrese Color' }
                }
            },
            in_marca: {
                validators: {
                    notEmpty: { message: 'Ingrese Marca' }
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
var Estacionamiento = /** @class */ (function () {
    function Estacionamiento() {
    }
    Estacionamiento.ingresar = function () {
        return Ajax.post('estacionamiento/ingreso', Estacionamiento.getFormIngreso());
    };
    Estacionamiento.retirar = function () {
        return Ajax["delete"]('estacionamiento/egreso/' + encodeURI(Estacionamiento.getFormEgreso()));
    };
    Estacionamiento.getFormIngreso = function () {
        return {
            color: $("#in_color").val(),
            patente: $("#in_dominio").val(),
            especial: $("#vehi_esp").is(":checked") ? '1' : '0',
            marca: $("#in_marca").val()
        };
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
    return Estacionamiento;
}());
var tabla_operaciones;
/// <reference path="./Operacion.ts" />
$(document).ready(function () {
    $("#a-operaciones").click(function (e) {
        $("#form-login").prop("hidden", true);
        $("#usuarios").prop("hidden", true);
        $("#estacionamiento").prop("hidden", true);
        $("#operaciones").prop("hidden", false);
        tabla_operaciones = new DataTable("tabla_operaciones");
        tabla_operaciones.ajax([
            { data: 'idCochera' },
            { data: 'patente' },
            { data: 'entrada' },
            { data: 'salida' },
            { data: 'tiempo' },
            { data: 'pago' },
            { data: 'idUser' },
        ]);
        Usuario.listar().done(function (e) {
            crearSelectUsr('lista_usuarios', e);
        });
        $("#operaciones").prop("hidden", false);
    });
    $("#btn-buscar-oper").click(function (e) {
        var datos = Operacion.getForm();
        tabla_operaciones.setPath('http://localhost/TPProgramcion-laboratorioIII2017/Api/operaciones/listar?id=' + datos.id + encodeURI('&from=' + datos.from + '&to=' + datos.to));
        tabla_operaciones.reloadTable();
        e.preventDefault();
    });
    $('#in_desde').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss'
    });
    $('#in_hasta').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        useCurrent: false //Important! See issue #1075
    });
    $("#in_desde").on("dp.change", function (e) {
        $('#in_hasta').data("DateTimePicker").minDate(e.date);
    });
    $("#in_hasta").on("dp.change", function (e) {
        $('#in_desde').data("DateTimePicker").maxDate(e.date);
    });
    $("#btn-exporta-pdf").click(function (e) {
        var datos = Operacion.getForm();
        datos["export"] = 'pdf';
        Ajax.get('operaciones/listar', datos);
        e.preventDefault();
    });
});
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
    return Operacion;
}());
function FechaSql(fecha) {
    var aux = fecha.split('');
    var fec = aux[0].split('-');
    var hor = aux[1];
    return fec[2] + '-' + fec[1] + '-' + fec[0] + ' ' + hor;
}
