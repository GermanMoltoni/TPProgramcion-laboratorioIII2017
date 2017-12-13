class Estadistica{
    public static getFormPeriodo(){
        return  ($("#in_periodo").val()).split('-')[1]+'-'+($("#in_periodo").val()).split('-')[0];

    }
    public static getFormFechas(){
        return {
            from:$("#in_desde_est").val(),
            to:$("#in_hasta_est").val(),
        };
    }
}