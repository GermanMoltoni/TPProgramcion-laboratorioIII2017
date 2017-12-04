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
        Ajax.get('listar').done(function (e) { console.log(e); }, function () { });
    };
    Usuario.listar = function () {
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
        var nombre = $("#nombre").val();
        var apellido = $("#apellido").val();
        var password = $("#password").val();
        var mail = $("#mail").val();
        var id = $("#id").val();
        var turno = $("#turno").val();
        var admin = $("#admin").val();
        var estado = $("#estado").val();
        var pathFoto = $("#pathFoto").val();
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
$(document).ready(function () {
    $("#login").click(function (e) {
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
    $("#logout").click(function (e) {
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
});
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
