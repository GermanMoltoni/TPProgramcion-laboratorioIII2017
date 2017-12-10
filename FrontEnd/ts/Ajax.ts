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
    public static put(path:string,data:any) {
        return $.ajax({
            url: Ajax.url+path,
            type: 'PUT',
            dataType: 'json',
            data: data,
            async:true,
            headers:{'token':Ajax.getToken()}
        });
    }
    public static delete(path:string,data:any) {
        return $.ajax({
            url: Ajax.url+path,
            type: 'DELETE',
            dataType: 'json',
            data: data,
            async:true,
            headers:{'token':Ajax.getToken()}
        });
    }
    public static postArchivo(path:string,data:any) {
        let form_data = new FormData();
        for(let ind in data){
            if(ind === 'file'){
                form_data.append('file', data[ind].files[0]);
            } else{
                form_data.append(ind, data[ind]);
            }
        }
        return $.ajax({
            url: Ajax.url+path,
          //  enctype: 'multipart/form-data',
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
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
