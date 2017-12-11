var tabla_operaciones;
$(document).ready(()=>{

    $("#a-operaciones").click((e)=>{
        $("#form-login").prop("hidden",true);
        $("#usuarios").prop("hidden",true);
        $("#estacionamiento").prop("hidden",true);
        tabla_operaciones = new DataTable("tabla_operaciones");
        
        $("#operaciones").prop("hidden",false);
    });
    $("#btn-buscar-oper").click((e)=>{
 
        e.preventDefault();
    });
    
 
    
});