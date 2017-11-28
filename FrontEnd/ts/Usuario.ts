declare var $;
class Usuario{
    private id:number;
    private mail:string;
    private nombre:string;
    private apellido:string;
    private password:string;
    private turno;
    private admin:boolean;
    private entrada:string;
    private pathFoto:string;
    private estado:boolean;
    private token:string;
    constructor(mail:string,nombre:string,apellido:string,password:string,estado:boolean,admin:boolean,turno?:number,pathFoto?:string,id?:number,entrada?:string,token?:string){
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
        let usuario = new Usuario();
    }
    public static listar(){
        
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
        $("#id").val(this.id);
        $("#mail").val(this.mail);
        $("#turno").val(this.turno);
        $("#admin").val(this.admin);
        $("#estado").val(this.estado);
        $("#pathFoto").val('');
    }
}