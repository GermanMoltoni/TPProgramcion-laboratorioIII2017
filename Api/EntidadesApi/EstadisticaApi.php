<?php
require './Entidades/Estadistica.php';

class EstadisticaApi extends Estadistica{

public static function FacturacionApi($request, $response, $args) {
    $datos = $request->getAttribute('datos');
    $from=$datos['from'];
    $to=$datos['to'];
    if($from == null || $to == null)
            return $response->withJson(array('error'=>'Faltan datos'));
    $op = parent::Facturacion($from,$to);
    
    if(count($op) == 0 || $op[0]->facturacion == null)
        return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));
    return $response->withJson($op);
  
}
public static function UsoCocherasApi($request, $response, $args) {
        $datos = $request->getAttribute('datos');
$from=$datos['from'];
    $to=$datos['to'];
    if($from == null || $to == null)
            return $response->withJson(array('error'=>'Faltan datos'));
    $op = parent::UsoDeCocheras($from,$to);
    if(count($op) == 0 || count($op['especial']) == 0)
        return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));
    return $response->withJson($op);
  
}

public static function ListadoVehiculosEstApi($request, $response, $args) {
        $datos = $request->getAttribute('datos');
$from=$datos['from'];
    $to=$datos['to'];
    if($from == null || $to == null)
            return $response->withJson(array('error'=>'Faltan datos'));
    $op = parent::ListadoVehiculosEstacionados($from,$to);
    
    if(count($op) == 0 || (count($op['repetidos']) == 0 && $op['distintos']==0))
        return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));
    return $response->withJson($op);
  
}



public static function PromedioFacMensualApi($request, $response, $args) {
    $periodo = $request->getAttribute('periodo');
    $op = parent::PromedioFacturacionMensual($periodo['mes'],$periodo['anio']);
    if($op == null)
        return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));
    return $response->withJson($op);
  
}
public static function PromedioAutosMensualApi($request, $response, $args) {
    $periodo = $request->getAttribute('periodo');
    $op = parent::PromedioAutosMensual($periodo['mes'],$periodo['anio']);
    if($op == 0)
        return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));
    return $response->withJson($op);
  
}
public static function PromedioUsuarioMensualApi($request, $response, $args) {
    $periodo = $request->getAttribute('periodo');
    $op = parent::PromedioUsuarioMensual($periodo['mes'],$periodo['anio']);
    if(count($op) == 0)
        return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));
    return $response->withJson($op);
  
}



}


?>