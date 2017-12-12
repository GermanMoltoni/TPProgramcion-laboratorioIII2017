var tabla_operaciones:DataTable;
/// <reference path="./Operacion.ts" />

$(document).ready(()=>{
    $("#a-operaciones").click((e)=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",true);
        $("#estacionamiento").prop("hidden",true);
        $("#operaciones").prop("hidden",false);
        tabla_operaciones = new DataTable("tabla_operaciones");
        tabla_operaciones.ajax([                
            {data:'idCochera'},
            {data:'patente'},
            {data:'entrada'},
            {data:'salida'},
            {data:'tiempo'},
            {data:'pago'},
            {data:'idUser'},
        ]);
         Usuario.listar().done((e)=>{
            crearSelectUsr('lista_usuarios',e);
        });
        $("#operaciones").prop("hidden",false);
    });
    $("#btn-buscar-oper").click((e)=>{
        let datos = Operacion.getForm()
        tabla_operaciones.setPath('http://localhost/TPProgramcion-laboratorioIII2017/Api/operaciones/listar?id='+datos.id+encodeURI('&from='+datos.from+'&to='+datos.to));
         tabla_operaciones.reloadTable();
        e.preventDefault();
    });
    
    $('#in_desde').datetimepicker({
        format: 'DD-MM-YYYY HH:mm:ss'
    });
    $('#in_hasta').datetimepicker({
        format: 'DD-MM-YYYY HH:mm:ss',
        useCurrent: false //Important! See issue #1075
    });
    $("#in_desde").on("dp.change", function (e:any) {
        $('#in_hasta').data("DateTimePicker").minDate(e.date);
    });
    $("#in_hasta").on("dp.change", function (e:any) {
        $('#in_desde').data("DateTimePicker").maxDate(e.date);
    });
    $("#btn-exporta-pdf").click((e)=>{
        let datos = Operacion.getForm();
        datos.export = 'pdf';
        Ajax.get('operaciones/listar',datos);
        e.preventDefault();
    });
    
});
function crearSelectUsr(id_div:any,arr_datos:any){
    let div = document.getElementById(id_div);
    if(div === null){
        return;
    }
    while (div.firstChild){
        div.removeChild(div.firstChild);
    }
    let label = document.createElement('label');
    label.textContent = 'Usuario';
    let select = document.createElement('select');
    select.id="sel-usr";
    select.name="sel-usr";
    select.className = "form-control"
    let opcion = document.createElement('option');
    opcion.value = '0';
    opcion.text = 'Todos';
    select.appendChild(opcion);
    if(arr_datos !== null){
        arr_datos.forEach(function(obj:any){
            let opcion = document.createElement('option');
            opcion.value = obj.id;
            opcion.text = obj.nombre+' '+obj.apellido;
            select.appendChild(opcion);
        });
    }
    div.appendChild(label);
    
    div.appendChild(select);
}