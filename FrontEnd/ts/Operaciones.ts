var tabla_operaciones;
$(document).ready(()=>{

    $("#a-operaciones").click((e)=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",true);
        $("#estacionamiento").prop("hidden",true);
        tabla_operaciones = new DataTable("tabla_operaciones");
        Usuario.listar().done((e)=>{
            crearSelect('lista_usuarios',e);
        });
        $("#operaciones").prop("hidden",false);
    });
    $("#btn-buscar-oper").click((e)=>{
 
        e.preventDefault();
    });
    
 
    
});
function crearSelect(id_div:any,arr_datos:any){
    let div = document.getElementById(id_div);
    if(div === null){
        return;
    }
    while (div.firstChild){
        div.removeChild(div.firstChild);
    }
    let select = document.createElement('select');
    select.id="sel-usr";
    select.name="sel-usr";
    let opcion = document.createElement('option');
    opcion.value = '';
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
    div.appendChild(select);
}