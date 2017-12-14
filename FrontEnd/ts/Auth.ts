/// <reference path="./types/jquery.d.ts" />
/// <reference path="./Ajax.ts" />
class Auth{
    private mail:string;
    private password:string;
    private token:string | undefined;
    constructor(mail:string,password:string){
        this.mail=mail;
        this.password=password;
    }
    public static setForm(){
        (<HTMLInputElement>document.getElementById('mail')).value = 'admin@admin';
        (<HTMLInputElement>document.getElementById('password')).value = '123';
    }
    private static clearForm(){
        (<HTMLInputElement>document.getElementById('mail')).value = '';
        (<HTMLInputElement>document.getElementById('password')).value = '';
    }
    public login(){
       return Ajax.post('login',{mail:this.mail,password:this.password});
    }
    public static logout(){
        localStorage.clear();
        sessionStorage.clear(); 
        Auth.clearForm();
    }
    public static pagina(tipo:boolean | null){
        if(tipo){
            $("#form-login").prop("hidden",true);
            $("#ul-admin").removeClass("hide_me");
        }
        else{
            $("#form-login").prop("hidden",true);
            $("#ul-user").removeClass("hide_me");
            $("#estacionamiento").prop("hidden",false);            
        }
        $("#ul-login").prop("hidden",true);
        $("#ul-logout").prop("hidden",false);
    }
}

