/// <reference path="./types/jquery.d.ts" />
/// <reference path="./Ajax.ts" />
class Usuario{ 
    private id:string| undefined;
    private mail:string;
    private nombre:string;
    private apellido:string;
    private password:string;
    private turno:string | undefined;
    private admin:string;
    private entrada:string | undefined;
    private pathFoto:string | undefined;
    private estado:string;
    private token:string | undefined;
    constructor(mail:string,nombre:string,apellido:string,password:string,estado:string,admin:string,turno?:string,pathFoto?:string,id?:string,entrada?:string,token?:string){
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
         return Ajax.post('usuario/alta',Usuario.getForm());
    }
    public static modificar(){
        return Ajax.post('usuario/modificar',Usuario.getForm());
    }
    public static listar(id?:number){
        return Ajax.get('usuario/listar',{id:id});
    }
    public static setUsuario(usuario:any){
        if(usuario != undefined)
            localStorage.setItem('usuario',JSON.stringify(usuario));
    }
    public static getUsuario(){
        let datos = localStorage.getItem('usuario');
        let usuario = JSON.parse(datos !== null?datos:'');
        if(usuario !== null){
            return new Usuario(usuario.mail,usuario.nombre,usuario.apellido,usuario.password,usuario.estado,usuario.admin,usuario.turno,usuario.pathFoto,usuario.id)
        }
       
    }
    public static jsonToUsuario(json:any){
        if(json !== null){
            return new Usuario(json.mail,json.nombre,json.apellido,json.password,json.estado,json.admin,json.turno,json.pathFoto,json.id)
        }
    }
    private static getForm(){
        return{
        "nombre":$("#in_nombre").val(),
        "apellido":$("#in_apellido").val(),
        "password":$("#in_passwd1").val(),
        "mail":$("#in_mail").val(),
        "id":$("#in_id").val(),
        "turno":$("#sel_turno :selected").val(),
        "admin":$("#admin_usr").is(":checked")?'1':'0',
        "estado":"1"};
    }
    public setForm(){
        console.log(this.id != undefined?this.id.toString():'');
        $("#in_nombre").val(this.nombre);
        $("#in_apellido").val(this.apellido);
        $("#in_passwd1").val('');
        $("#in_id").val(this.id != undefined?this.id.toString():'');
        $("#in_mail").val(this.mail);
        $("#sel_turno").val(this.turno != undefined?this.turno.toString():'');
        if(this.admin != undefined && this.admin)
            $('#admin_usr').bootstrapToggle('on');
        else
            $('#admin_usr').bootstrapToggle('off');
        $("#pathFoto").val('');
    }
    public static getTipo(){
        let usuario = Usuario.getUsuario();
        return usuario != undefined && usuario.admin;
    }
    public cambiarEstado(){
        return Ajax.put('usuario/estado',{id:this.id});
        
    }
}
