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
    public static listar(){
        Ajax.get('usuario/listar').done((e:any)=>{console.log(e)},()=>{}); 
        
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
    public static getTipo(){
        let usuario = Usuario.getUsuario();
        return usuario != undefined && usuario.admin;
    }
}
