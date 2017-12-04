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
        $("#mail").val('admin@admin');
        $("#password").val('123');
    }
    public login(){
       return Ajax.post('login',{mail:this.mail,password:this.password});
    }
    public static logout(){
        localStorage.clear();
        sessionStorage.clear(); 
    }
    public setToken(token:any){
        if(token !== undefined)
            localStorage.setItem('token',token);
    }
    public getToken(token:string){
        return localStorage.getItem('token');
    }
}

