class Estadistica{
    public static getFormPeriodo(){
        if($("#in_periodo").val() !== '')
            return  ($("#in_periodo").val()).split('-')[1]+'-'+($("#in_periodo").val()).split('-')[0];
        return null;
    }
    public static vaciarForm(){
        $("#in_desde_est").val('');
        $("#in_hasta_est").val('');
        $("#in_periodo").val('');
        $('#lbl-factu').text('');
        $('#lbl-factu-periodo').text('');
        $('#lbl-autos-periodo').text('');
        $('#lbl-factu-mensual').text('');
        $('#lbl-autos-mensual').text('');
    }
    public static getFormFechas(){
        return {
            from:$("#in_desde_est").val(),
            to:$("#in_hasta_est").val(),
        };
    }
}