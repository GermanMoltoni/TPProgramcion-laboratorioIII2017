 <table class="table table-condensed">
     <thead>
         <tr class="active">
             <th>Piso</th>
             <th class="text-center"colspan="2">Lugares</th>
        </tr>
        <tr class="active">
            <th></th>
            <th>Disp.</th>
            <th>Ocup.</th>
        </tr>
    </thead>
    <tbody>


<?php

require_once '../Entidades/Piso.php';
$pisos = Piso::BuscarPiso();
foreach($pisos as $piso)
{
        $ocupados = count($piso->LugaresOcupados());
    $libres = $piso->cantidadCocheras - $ocupados;
?>
 <tr><td><?php echo $piso->idPiso?></td><td><?php echo  $libres;?></td><td><?php echo $ocupados?></td><tr>
<?php

}
?>
             </tbody>
     </table>
 