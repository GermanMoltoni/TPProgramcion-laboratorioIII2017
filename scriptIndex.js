$(document).ready(function(){
    sendToken(getToken());
    $("#btnLogin").click(function(){
        $.ajax({
            url:'./partes/loginForm.php',
            type:'POST',
            cache: false,
            async:true
        }).done(function(obj){
                $("#general").html(obj);
            });
    });
        $.ajax({
            url:'./partes/tarifas.php',
            type:'POST',
            cache: false,
            async:true
        }).done(function(obj){
            $("#precios").html(obj);
        }); 
        lugares();
});
function sendToken(token){
            if(token == false)
                return;
            $.ajax({
            url:'./login',
            type:'POST',
            cache: false,
            async:true,
            headers:{'token':token}
            }).done(function(obj){
            if(obj!= false)
            {
                $('#menuLogin').hide();
                $('#menuUser').show();
                $("#general").html("");
                if(obj.user.admin == "1")
                    $('#admin').show();
                $('#user').show();
                $("#userName").html(obj.user.nombre);
            }
        });
        
        
}
function lugares(){
    $.ajax({
            url:'./partes/lugares.php',
            type:'POST',
            cache: false,
            async:true,
            headers:{'token':getToken()}
        }).done(function(obj){
            $("#pisos").html(obj);
        });
}

function cargarAuto(){
            $.ajax({
                url:'./partes/autoForm.php',
                type:'POST',
                cache: false,
                async:true,
                headers:{'token':getToken()}
            }).done(function(data){
  $("#select").html("");
            $("#inputDate").html("");
            $("#radio").html("");               
             $("#general").html(data);
                
            }).fail().always();
}
function cobrar(){
            $.ajax({
                url:'./partes/cobrarForm.php',
                type:'POST',
                cache: false,
                async:true,
            headers:{'token':getToken()}
            }).done(function(data){
                borrarForm();
                $("#general").html(data);
            }).fail().always();
}


function cobrarAuto(){
$.ajax({
            url:'./autos/egreso/'+$("#patente").val(),
            type:'DELETE',
            cache: false,
            async:true,
            headers:{'token':getToken()}
        }).done(function(data){
            if('error' in data)
                alert(data.error);
            else
                {
                    lugares();
                    $("#modalBody").html(tablaCobroAuto(data));  
                $("#myModal").modal("show");
                
                }
            
});
}

    
function cocheras(){
    var c = "<script>   $('[data-toggle=popover]').popover({ html : true }).click(function () {setTimeout(function () {$('[data-toggle=popover]').popover('hide');}, 2000)});  </script>";
            $.ajax({
            url:'./estacionamiento/listaCocheras',
            type:'GET',
            cache: false,
            contentType: false,
            processData: false,
            headers:{'token':getToken()}
        }).done(function(obj){
              $("#select").html("");
            $("#inputDate").html("");
            $("#radio").html("");
                $("#general").html(tablaCocheras(obj)+c);
            }).fail().always();
}


function tablaCobroAuto(array){
  var tabla='<table class="table table-condensed"><thead class="thead-default"><tr><th>Patente</th><th>Marca</th><th>Color</th><th>Cochera</th><th>Entrada</th><th>Salida</th><th>Tiempo</th><th>Valor a cobrar</th></tr></thead></tbody>';
    array.forEach(function(operacion) {
    tabla+='<tr><td>'+operacion.patente+'</td><td>'+operacion.marca+'</td><td>'+operacion.color+'</td><td>'+operacion.idCochera+'</td><td>'+operacion.entrada+'</td><td>'+operacion.salida+'</td><td>'+operacion.tiempo+'</td><td>$'+operacion.pago+'</td></tr>'; 
    }, this);
    return tabla+"</tbody></table>";
}


function ingresarAuto(){
            $.ajax({
                url:'./estacionamiento/ingreso',
                type:'POST',
                cache: false,
                contentType: false,
                processData: false,
                data:formAuto(),
            headers:{'token':getToken()}
            }).done(function(data){
                console.info(data);
                if('cochera' in data)
                {
                    $("#general").html("");
                    alert("Estacionar en la cochera:"+data.cochera);
                    lugares();
                }
                else
                    alert(data.error);
            }).fail().always();
}
function formAuto(){
    var formData = new FormData();
    formData.append('patente',$("#patente").val());
    formData.append('marca',$("#marca").val());
    formData.append('color',$("#color").val());
    formData.append('especial',($("#especial").is(':checked'))?'1':'0');
    return formData;
}


function operaciones(){
$.ajax({
            url:'./estacionamiento/listaroperaciones',
            type:'GET',
            cache: false,
            async:true,
            headers:{'token':getToken()}
        }).done(function(obj){
            $("#radio").html(radioFecha());
            $("#inputDate").html(daterange());
            //$("#general").html(OperationTable(obj));
                     //   $("#general").html('');

            $('#table').DataTable( {
        data: obj,
        paging: false,
        searching: false,
        info:false,
        columns: [
            { data: "idUser" ,title: "idUser"},
            { data: "patente" ,title: "patente"},
            { data: "idCochera",title: "idCochera" },
            { data: "entrada",title: "entrada" },
            { data: "salida" ,title: "salida"},
            { data: "tiempo" ,title: "tiempo"},
            { data: "pago" ,title: "pago"}
        ]
    } );
});}

function OperationTable(array){
    var turno;
    var table='<table class="table table-condensed"><thead class="thead-default"><tr><th>ID Usuario</th><th>Patente</th><th>Cochera</th><th>Entrada</th><th>Salida</th><th>Tiempo</th><th>Valor a cobrar</th></tr></thead></tbody>';
    array.forEach(function(operacion) {
    table+='<tr><td>'+operacion.idUser+'</td><td>'+operacion.patente+'</td><td>'+operacion.idCochera+'</td><td>'+operacion.entrada+'</td><td>'+operacion.salida+'</td><td>'+operacion.tiempo+'</td><td>'+operacion.pago+'</td></tr>';
    }, this);
    return table+"</tbody></table>";
}



function tablaCocheras(array){
    var table='<table id="tablaCocheras" class="table table-condensed"><tbody>';
    var flag;
    (array.pisos).forEach(function(piso){
        table+='<tr>';
        for(var i=piso.idPiso*100;i<(piso.idPiso*100+piso.cantidadCocheras);i++)
        {
            try{
            (array.ocupados).forEach(function(auto)
            {
                if(auto.idCochera == i)
                {
                        table+='<td id='+i+'><a  data-toggle="popover" title="Nº'+auto.idCochera+'" data-content="<ul><li>Patente:'+auto.patente+'</li><li>Color: '+auto.color+'</li><li>Marca:'+auto.marca+'</li>"><i class="material-icons" style="color:red;">directions_car</i> </td>';
                        flag = false;
                        throw e;
                        
                }
                else
                    flag = true;
            });
        }
        catch(e){

        }
        if(flag)
            table+='<td id='+i+'><i class="material-icons" style="color:green;">directions_car</i> </td>';
    
        }
        table+='</tr>';
        });
        
    table+='</tr></tbody></table>';
    return table;


}


function tablaPisos(array){
   var tabla=' <table class="table table-condensed"><thead><tr class="active"><th>Piso</th><th class="text-center"colspan="2">Libres</th></tr><tr class="active"><th></th><th>Disp.</th><th>Ocup.</th></tr></thead><tbody>';
  array.forEach(function(piso){
    tabla+='<tr><td>'+piso.numero+'</td><td>'+piso.cantidadCocheras+'</td><td>'+piso.cantidadAutos+'</td><tr>';
    });
  tabla+='</table>';  
  return $array;
}



function daterange(){
    var a = "<script>var start = moment().subtract(29, 'days');var end = moment();function cb(start, end) {$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));}$('#reportrange').daterangepicker({ 'startDate': '06/02/2017','endDate': '06/08/2017'},cb);cb(start, end);</script>";
    var b='<br><div id="reportrange" class="col-md-6" style="background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc; width: 80%"><i class="glyphicon glyphicon-calendar fa fa-calendar"></i>&nbsp;<span></span> <b class="caret"></b></div>';
    return a+b;
}


 
function datetimerange(){
        var b='<br><div id="datetime" class="col-md-6" style="background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc; width: 50%"><i class="glyphicon glyphicon-calendar fa fa-calendar"></i>&nbsp;<span></span> <b class="caret"></b></div>';
        var a ='<script>$("#datetime").daterangepicker({"timePicker": true,"linkedCalendars": false,"startDate": "06/02/2017","endDate": "06/08/2017"});</script>';
        return a+b;
}


function radioFecha(){
    var a=  "<script>$('#radio').change(function(){if($('input[name=radioFecha]:checked').val() != 'fecha'){$('#inputDate').html(datetimerange());}else{$('#inputDate').html(daterange());}});</script>";
    var b="<br><input type='radio' name='radioFecha' value='fecha' checked>Fecha<br><input name='radioFecha' type='radio' >Fecha y Hora";
    return a+b;
}



function borrarForm(){
    $("#select").html("");
            $("#inputDate").html("");
            $("#radio").html("");
}



function login(){
        $.ajax({
            url:'./login',
            type:'POST',
            cache: false,
            async:true,
            data:{id: $("#id").val(),password:$("#passwd").val(),remember:$("#remember").is(':checked')}
        }).done(function(obj){
            if(obj!= false)
            {
                setToken(obj,$("#remember").is(':checked'));
                $('#menuLogin').hide();
                $('#menuUser').show();
                $("#general").html("");
                if(obj.user.admin == "1")
                    $('#admin').show();
                    $('#user').show();
                    $("#userName").html(obj.user.nombre);
            }
        });
}

function logout(){
    $.ajax({
            url:'./logout',
            type:'GET',
            cache: false,
            async:true,
            headers:{'token':getToken()}
        }).done(function(){
            removeToken();
            $("#user").hide();
            $("#pisos").hide();
            $("#admin").hide();
            $('#menuLogin').show();
            $('#menuUser').hide();
            $("#general").html("");
            $("#select").html("");
            $("#inputDate").html("");
            $("#radio").html("");

});
}

function baja(id){
    $.ajax({
            url:'./users/bajausuario/'+id,
            type:'DELETE',
            cache: false,
            async:true,
            headers:{'token':getToken()}
        }).done(function(obj){
            if(obj != false)
                $("#general").html(UserTable(obj));
            else
                alert('El usuario no existe');

});
}








function suspenderUser(id){

$.ajax({
            url:'./users/suspenderusuario/'+id,
            type:'PUT',
            cache: false,
            async:true,
            headers:{'token':getToken()}
        }).done(function(obj){
            if(obj != false)
                $("#general").html(UserTable(obj));
            else
                alert('El usuario no existe');  
});
}


function habilitarUser(id){
$.ajax({
            url:'./users/habilitarusuario/'+id,
            type:'PUT',
            cache: false,
            async:true,
            headers:{'token':getToken()}
        }).done(function(obj){
            if(obj != false)
                $("#general").html(UserTable(obj));
            else
                alert('El usuario no existe');   
});
}


//---------------------------
function altaUser(){
    $.ajax({
                url:'./partes/signUpForm.php',
                type:'POST'
            }).done(function(data){
  $("#select").html("");
            $("#inputDate").html(" ");
            $("#radio").html("");
                $("#general").html(data);
            });
}
 function signUp(){
            $.ajax({
                url:'./users/signup',
                type:'POST',
                cache: false,
                contentType: false,
                processData: false,
                data:form(),
            headers:{'token':getToken()}
            }).done(function(data){
        $("#select").html("");
            $("#inputDate").html("");
            $("#radio").html("");
                $("#general").html('');


            }).fail().always();
 }
function listUser(){
$.ajax({
            url:'./users/listUsers',
            type:'GET',
            headers:{'token':getToken()},
            cache: false,
            async:true
        }).done(function(obj){
  $("#select").html("");
            $("#inputDate").html("");
            $("#radio").html("");
            $("#general").html(UserTable(obj)); 
});
}

 /**
 * Obtiene los datos del formulario y devuelve un obj formdata
 */
function form(){
    var formData = new FormData();
    formData.append('name',$("#name").val());
    formData.append('surname',$("#surname").val());
    formData.append('id',$("#id").val());
    formData.append('password',$("#password").val());
    formData.append('turno',$("#turno").find(":selected").val());
    formData.append('state',($("#state").is(':checked'))?1:0);
    formData.append('admin',($("#admin").is(':checked'))?1:0);
    return formData;
}



function operacionesUser(){
$.ajax({
            url:'./users/listUsersLog',
            type:'GET',
            cache: false,
            async:true,
            headers:{'token':getToken()}
        }).done(function(obj){
            $("#general").html(UserOperationTable(obj.operaciones));
            $("#select").html(UserSelect(obj.users));
                                     $("#inputDate").html(datarange()); 
                                     radioFecha();

});}

function listarLogs(){
    $.ajax({
            url:'./users/listUsersLog',
            type:'GET',
            cache: false,
            async:true,
            headers:{'token':getToken()}
        }).done(function(obj){
            $("#general").html(UserLogTable(obj));
            
            filtros(obj);
});
}


function uniqueiD(array){
    var flag={};
    var aux = array.filter(function(user){
        if(user.id in flag)
            return false;
        flag[user.id]=true;
        return true;
    });
    return aux;
}


function UserSelect(array){
  var select = "<div class='col-md-12'><label for='idUser'>Usuarios</label><select id='idUser' class='form-control'>";
  select+="<option value='0'>Todos</option>";
  array.forEach(function(user) {
  
    select+="<option value="+user.id+">"+user.id+'-'+user.nombre+" "+user.apellido+"</option>";

    }, this);
  return select+"</select></div>";
}




/*
*   Tablas
*   - Logs
*   - Operaciones
*   - Usuarios
*/
function UserLogTable(array){
    var turno;
    var table="<div class='container-fluid'><table class='table bg-info table-striped table-condensed'><thead  class='bg-primary'><tr><th class='col-md-2 '>Id</th><th class='col-md-3'>Nombre y Apellido</th><th class='col-md-2'>Turno</th><th class='col-md-3'>Entrada</th><th class='col-md-3'>Salida</th></thead><tbody>";
    array.forEach(function(user) {
        if(user.turno == 1)
            turno = "Mañana";
        else if(user.turno == 2)
            turno = "Tarde";
        else if (user.turno == 2)
            turno = "Noche";
        else
            turno = " ";
        table+="<tr><td>"+user.id+"</td><td>"+user.nombre+","+user.apellido+"</td><td>"+turno+"</td><td>"+user.entrada+"</td><td>"+user.salida+"<td></tr>";
    }, this);
    return table+"</select></div>";
}
function UserTable(array){
    var table="<div class='col-md-10'><table class='table bg-info table-striped table-condensed'><thead  class='bg-primary'><tr><th class='col-md-2 '>Id</th><th class='col-md-2'>Nombre y Apellido</th><th class='col-md-1' >Estado</th><th class='col-md-1'>Admin</th><th class='col-md-2'>Administrar</th></tr></thead><tbody>";
    array.forEach(function(user) {
        table+="<tr><td>"+user.id+"</td><td>"+user.nombre+","+user.apellido+"</td><td>";
    if(!user.estado && !user.admin)
      table+="<i class='material-icons'>block</i>";
    else if(user.estado || user.admin)
      table+="<span class='fa fa-user'></span>";
    table+="</td><td>";
    if(user.admin)
      table+="<i class='material-icons'>supervisor_account</i>";
    table+="</td><td><div class='btn-group'><a class='btn btn-info' data-toggle='dropdown'  href='#'><i class='fa fa-user fa-fw'></i>Administrar</a><a class='btn btn-info dropdown-toggle' data-toggle='dropdown' href='#'>";
    table+="<span class='fa fa-caret-down' title='Toggle dropdown menu'></span></a><ul class='dropdown-menu'><li><a href='#' onClick=habilitarUser("+user.id+")><i class='fa fa-pencil fa-fw'></i>Habilitar</a></li><li><a href='#' onClick='suspenderUser("+user.id+")'><i class='fa fa-ban fa-fw'></i>Suspender</a></li><li><a href='#' onClick='baja("+user.id+")'><i class='fa fa-trash-o fa-fw'></i>Baja</a></li>";
  table+="</ul></div></td></tr>";
    }, this);
    return table+"</tbody></table>";
}
 

function filtros(obj){
    $('#select').html(UserSelect(uniqueiD(obj)));
    $('#radio').html(radioFecha());
    $('#inputDate').html(daterange());
    $('#btn').html('<br><button type="button" class="btn btn-default">Filtrar</button>');
}

function setToken(obj,option=false){
    if(window.localStorage || window.sessionStorage)
    {
        if(option)
        {
            localStorage.setItem('user',obj.user);
            localStorage.setItem('token',obj.token);
        }
        else
        {
           sessionStorage.setItem('user',obj.user);
           sessionStorage.setItem('token',obj.token);
        }
}
}

function getToken(){
    if(window.localStorage || window.sessionStorage)
        {
            if(localStorage.getItem('token'))
                return localStorage.getItem('token');
            else if(sessionStorage.getItem('token'))
                return sessionStorage.getItem('token');
            
        }
        return false;
}


function removeToken(){
    if(window.localStorage || window.sessionStorage)
        {
            if(localStorage.getItem('token'))
                return localStorage.removeItem('token');
            else if(sessionStorage.getItem('token'))
                return sessionStorage.removeItem('token');
        }
        return false;
}