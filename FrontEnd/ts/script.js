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
    Usuario.listar = function () {
        Ajax.get('usuario/listar').done(function (e) { console.log(e); }, function () { });
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
        $("#nombre").val(this.nombre);
        $("#apellido").val(this.apellido);
        $("#password").val('');
        $("#id").val(this.id != undefined ? this.id : '');
        $("#mail").val(this.mail);
        $("#turno").val(this.turno != undefined ? this.turno : '');
        $("#admin").val(this.admin != undefined ? this.admin : '');
        $("#estado").val(this.estado != undefined ? this.estado : '');
        $("#pathFoto").val('');
    };
    Usuario.getTipo = function () {
        var usuario = Usuario.getUsuario();
        return usuario != undefined && usuario.admin;
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
            Usuario.setUsuario(e.user);
            if (e.error != undefined) {
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
        ValidadorForm(validator_usuario);
        $("#modal-nuevo-usuario").modal("show");
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#btn-modificar-usuario").click(function (e) {
        var datos = localStorage.getItem('tr-tabla_usuarios');
        var usuario = JSON.parse(datos !== null ? datos : '');
        Ajax.get();
        if (usuario != null)
            usuario.setForm();
        console.log(usuario);
        ValidadorForm(validator_usuario);
        $("#modal-nuevo-usuario").modal("show");
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $("#a-usuarios-lis").click(function (e) {
        $("#form-login").prop("hidden", true);
        $("#usuarios").prop("hidden", false);
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
                    return row.admin == 1 ? 'Administrador' : 'Empleado';
                } },
            { render: function (data, type, row) {
                    return row.pathFoto == null ? 'Sin Foto' : '<img src=' + row.pathFoto + '>';
                } },
        ], 'http://localhost/TPProgramcion-laboratorioIII2017/Api/usuario/listar');
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
var validator_usuario = {
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
    DataTable.prototype.ajax = function (columns, path) {
        $('#' + this.id_tabla).DataTable().destroy();
        this.dt = $('#' + this.id_tabla).DataTable({
            autoWidth: false,
            destroy: true,
            ajax: { url: path,
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
