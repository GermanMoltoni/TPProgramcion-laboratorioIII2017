
<table class="table table-condensed">
     <thead>
         <tr class="active"><th>Tiempo</th><th>Valor</th>
             </tr>
         </thead>
         <tbody>

<?php
require_once '../Entidades/AccesoDatos.php';
$objDB = AccesoDatos::DameUnObjetoAcceso();
$consulta = $objDB->RetornarConsulta("SELECT valor FROM tarifas");
$consulta->execute();
$array = $consulta->fetchAll(PDO::FETCH_COLUMN,0);

?>
 
 
             <tr ><td>Hora</td><td><?php echo $array[1]?></td>
             </tr>
             <tr><td>Media Estadia</td><td><?php echo $array[2]?></td>
             </tr>
             <tr><td>Estadia Completa</td><td><?php echo $array[0]?></td>
             </tr>
             </tbody>
     </table>



