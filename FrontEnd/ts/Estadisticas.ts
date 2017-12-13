var tabla_est_fechas:DataTable;
var tabla_est_mensual:DataTable;
$(document).ready(()=>{
    tabla_est_fechas = new DataTable("tabla_est_fechas",false);
    tabla_est_mensual = new DataTable("tabla_est_mensual",false);
    tabla_est_fechas.iniciar();
    tabla_est_mensual.iniciar();
    $("#a-estadistica").click((e)=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",true);
        $("#estacionamiento").prop("hidden",true);
        $("#operaciones").prop("hidden",true);
        $("#estadistica").prop("hidden",false);
        e.preventDefault();
    });
    $("#btn-bus-mensual").click((e)=>{
        let datos = Estadistica.getFormPeriodo()
        tabla_est_mensual.ajax([                
            {data:'idUser'},
            {data:'promedio'},
        ],'estadistica/promediousuariomensual?'+encodeURI('periodo='+datos));
        Ajax.get('estadistica/promediofacturacionmensual?'+encodeURI('periodo='+datos)).done((res)=>{
            if(res.msg == undefined){
                $("#lbl-factu-mensual").text(res);
            }
        });
        Ajax.get('estadistica/promedioautosmensual?'+encodeURI('periodo='+datos)).done((res)=>{
            if(res.msg == undefined){
                $("#lbl-autos-mensual").text(res);
            }
        });
        e.preventDefault();
    });
    $('#in_hasta_est').datetimepicker({
        format: 'YYYY-MM-DD',
        useCurrent: false //Important! See issue #1075
    });
    $('#in_desde_est').datetimepicker({
        format: 'YYYY-MM-DD'
    });
    $('#in_periodo').datetimepicker({
        format: 'MM-YYYY',
        useCurrent: false //Important! See issue #1075
    });
    $("#in_desde_est").on("dp.change", function (e:any) {
        $('#in_hasta_est').data("DateTimePicker").minDate(e.date);
    });
    $("#in_hasta_est").on("dp.change", function (e:any) {
        $('#in_desde_est').data("DateTimePicker").maxDate(e.date);
    });
    $("#btn-bus-est").click((e)=>{
         let datos = Estadistica.getFormFechas()
        
        Ajax.get('estadistica/facturacion?'+encodeURI('&from='+datos.from+'&to='+datos.to)).done((res)=>{
            if(res.msg == undefined){
                $("#lbl-factu-periodo").text(res[0].facturacion);
                $("#lbl-autos-periodo").text(res[0].cantidad_autos);
            }
        });
        Ajax.get('estadistica/vehiculos?'+encodeURI('&from='+datos.from+'&to='+datos.to)).done((res)=>{
            if(res.msg == undefined){
                $("#lbl-factu-periodo").text(res[0].facturacion);
                $("#lbl-autos-periodo").text(res[0].cantidad_autos);
            }
        });
      /*  tabla_operaciones.ajax([                
            {data:'cochera'},
            {data:'cantidad'},

        ],'operaciones/listar?'+encodeURI('from='+datos.from+'&to='+datos.to));
        tabla_oper_usr.ajax([                
            {data:'idUser'},
            {data:'cantidad'},

        ],'http://localhost/TPProgramcion-laboratorioIII2017/Api/operaciones/operacionesUsuarios?id='+datos.id+encodeURI('&from='+datos.from+'&to='+datos.to));
         */
        e.preventDefault();
    });
});