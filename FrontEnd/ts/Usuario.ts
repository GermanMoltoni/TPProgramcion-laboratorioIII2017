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
         return Ajax.postForm('usuario/alta',Usuario.getForm());
    }
    public static modificar(){
        return Ajax.postForm('usuario/modificar',Usuario.getForm());
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
        if(datos != null){
            let usuario = JSON.parse(datos);
            return Usuario.jsonToUsuario(usuario);                   
        }
        return null;
    }
    public static jsonToUsuario(json:any){
        if(json !== null){
            return new Usuario(json.mail,json.nombre,json.apellido,json.password,json.estado,json.admin,json.turno,json.pathFoto,json.id)
        }
        return null;
    }
    private static getForm():FormData{
        let form = new FormData();
        form.append("nombre",$("#in_nombre").val());
        form.append("apellido",$("#in_apellido").val());
        form.append("password",$("#in_passwd1").val());
        form.append("mail",$("#in_mail").val());
        form.append("id",$("#in_id").val());
        form.append("turno",$("#sel_turno :selected").val());
        form.append("admin",$("#admin_usr").is(":checked")?'1':'0');
        form.append("estado",'1');
        let file = $("#file").prop("files")[0];
        if(file != undefined)
            form.append("file",file);   
        return form;
    }
    public setForm(){
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
        return usuario != null && (usuario.admin == '1');
    }
    public cambiarEstado(){
        return Ajax.put('usuario/estado',{id:this.id}); 
    }
    public static vaciarFormFec(){
        $("#in_des_usr").val('');
        $("#in_has_usr").val('');
    }
    public static getFechas(){
        return {
            id:0,
            from:$("#in_des_usr").val(),
            to:$("#in_has_usr").val(),
        };
    }
    public static  crearSelectUsr(id_div:any,arr_datos:any){
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
    static vaciarFrm(){
        $("#in_nombre").val('')
        $("#in_apellido").val('')
        $("#in_passwd1").val('')
        $("#in_mail").val('')
        $("#in_id").val('')
        $("#sel_turno").val('')
    }
}
