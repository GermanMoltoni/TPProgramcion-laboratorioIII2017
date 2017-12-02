/// <reference path="./types/jquery.d.ts" />
class Ajax{
    private static url:string = 'http://localhost/TPProgramcion-laboratorioIII2017/Api/';
    public static get(path:string, data?:any) {
        return $.ajax({
            url: Ajax.url+path,
            type: 'GET',
            dataType: 'json',
            data: data,
            async:true,
            headers:{'token':Ajax.getToken()}
        });
    }
    public static post(path:string,data:any) {
        return $.ajax({
            url: Ajax.url+path,
            type: 'POST',
            dataType: 'json',
            data: data,
            async:true,
            headers:{'token':Ajax.getToken()}
        });
    }
    private static getToken(){
        let token = localStorage.getItem('token');
        if(token !== null)
            return token;
        //return null;
    }
    private static setToken(data:any){
        localStorage.setItem('token',data);

    }
}
