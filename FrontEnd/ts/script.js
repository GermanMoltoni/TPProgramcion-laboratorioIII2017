/// <reference path="./types/jquery.d.ts" />
var Ajax = /** @class */ (function () {
    function Ajax() {
    }
    Ajax.get = function (path, done, fail, data) {
        $.ajax({
            url: Ajax.url + path,
            type: 'GET',
            dataType: 'json',
            data: data,
            async: true,
            headers: { 'token': Ajax.getToken() }
        }).done(done).fail(fail);
    };
    Ajax.post = function (path, data, done, fail) {
        $.ajax({
            url: Ajax.url + path,
            type: 'POST',
            dataType: 'json',
            data: data,
            async: true,
            headers: { 'token': Ajax.getToken() }
        }).done(done).fail(fail);
    };
    Ajax.getToken = function () {
        var token = localStorage.getItem('token');
        if (token !== null)
            return token;
        return false;
    };
    Ajax.setToken = function (data) {
        localStorage.setItem('token', data);
    };
    Ajax.url = 'http://germanmoltoni.byethost12.com/';
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
        Ajax.get('listar', function (e) { console.log(e); }, function () { });
    };
    Usuario.listar = function () {
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
    Usuario.login = function (datos) {
        Ajax.post('login', datos, function (e) { console.log(e); }, function () { });
    };
    return Usuario;
}());
$(document).ready(function () {
    Usuario.login({ usuario: 'germanAdmin', password: '123' });
});
