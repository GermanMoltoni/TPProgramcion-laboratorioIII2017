import * as $ from "jquery";
export class Ajax{
    private static url:string = 'http://germanmoltoni.esy.es/';
    public static get(path:string,done:any, fail:any, data?:any) {
        $.ajax({
            url: Ajax.url+path,
            type: 'GET',
            dataType: 'json',
            data: data
        }).done(done).fail(fail);
    }
    public static post(path:string,data:any, done:any, fail:any) {
        $.ajax({
            url: Ajax.url+path,
            type: 'POST',
            dataType: 'json',
            data: data
        }).done(done).fail(fail);
    }
}
