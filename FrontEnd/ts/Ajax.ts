/// <reference path="./types/jquery.d.ts" />
class Ajax{
    private static url:string = 'http://germanmoltoni.byethost12.com/';
    public static get(path:string,done:any, fail:any, data?:any) {
        $.ajax({
            url: Ajax.url+path,
            type: 'GET',
            dataType: 'json',
            data: data,
            async:true,
            headers:{'token':Ajax.getToken()}
        }).done(done).fail(fail);
    }
    public static post(path:string,data:any, done:any, fail:any) {
        $.ajax({
            url: Ajax.url+path,
            type: 'POST',
            dataType: 'json',
            data: data,
            async:true,
            headers:{'token':Ajax.getToken()}
        }).done(done).fail(fail);
    }
    private static getToken(){
        let token = localStorage.getItem('token');
        if(token !== null)
            return token;
        return false;
    }
    private static setToken(data:any){
        localStorage.setItem('token',data);

    }
}
