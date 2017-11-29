import * as $ from "jquery";
import {Ajax} from './Ajax';
export class Usuario{
    private id:number| undefined;
    private mail:string;
    private nombre:string;
    private apellido:string;
    private password:string;
    private turno:number | undefined;
    private admin:string;
    private entrada:string | undefined;
    private pathFoto:string | undefined;
    private estado:string;
    private token:string | undefined;
    constructor(mail:string,nombre:string,apellido:string,password:string,estado:string,admin:string,turno?:number,pathFoto?:string,id?:number,entrada?:string,token?:string){
        this.id=id;
        this.mail=mail;
        this.nombre=nombre;
        this.apellido=apellido;
        this.password=password;
        this.estado=estado;
        this.turno=turno;
        this.admin=admin;
        this.entrada=entrada;
        this.pathFoto=pathFoto;
        this.token=token;
    }
    public static crear(){
        //let usuario = new Usuario();
    }
    public static listar(){
        Ajax.post('login',{usuario:'germanAdmin',password:'123'},(e:any)=>{console.log(e)},()=>{});
    }
    private static getForm(){
        let nombre = $("#nombre").val();
        let apellido = $("#apellido").val();
        let password = $("#password").val();
        let mail = $("#mail").val();
        let id = $("#id").val();
        let turno = $("#turno").val();
        let admin = $("#admin").val();
        let estado = $("#estado").val();
        let pathFoto = $("#pathFoto").val();
    }
    public setForm(){
        $("#nombre").val(this.nombre);
        $("#apellido").val(this.apellido);
        $("#password").val('');
        $("#id").val(this.id != undefined?this.id:'');
        $("#mail").val(this.mail);
        $("#turno").val(this.turno != undefined?this.turno:'');
        $("#admin").val(this.admin != undefined?this.admin:'');
        $("#estado").val(this.estado != undefined?this.estado:'');
        $("#pathFoto").val('');
    }
}


$(document).ready(()=>{
    Usuario.listar();
}
);
