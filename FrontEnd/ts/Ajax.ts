
declare var $;
class Ajax{
    private static url:string = 'http://germanmoltoni.esy.es/';
    public static get(done, fail, data = null) {
        $.ajax({
            url: Ajax.url,
            type: 'GET',
            dataType: 'json',
            data: data
        }).done(done).fail(fail);
    }
    public static post(data, done, fail) {
        $.ajax({
            url: Ajax.url,
            type: 'POST',
            dataType: 'json',
            data: data
        }).done(done).fail(fail);
    }
}
