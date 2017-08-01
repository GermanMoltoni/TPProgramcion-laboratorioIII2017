<?php
require './Entidades/Estadistica.php';

class EstadisticaApi extends Estadistica{

public static function FacturacionApi($request, $response, $args) {
    $from = filter_var($request->getParam('from'), FILTER_SANITIZE_STRING);
    $to = filter_var($request->getParam('to'), FILTER_SANITIZE_STRING);
    if($from == null || $to == null)
            return $response->withJson(array('error'=>'Faltan datos'));
    $op = parent::Facturacion($from,$to);
    
    if(count($op) == 0)
        return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));
    return $response->withJson($op);
  
}
public static function UsoCocherasApi($request, $response, $args) {
    $from = filter_var($request->getParam('from'), FILTER_SANITIZE_STRING);
    $to = filter_var($request->getParam('to'), FILTER_SANITIZE_STRING);
    if($from == null || $to == null)
            return $response->withJson(array('error'=>'Faltan datos'));
    $op = parent::UsoDeCocheras($from,$to);
    if(count($op) == 0)
        return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));
    return $response->withJson($op);
  
}

public static function ListadoVehiculosEstApi($request, $response, $args) {
    $from = filter_var($request->getParam('from'), FILTER_SANITIZE_STRING);
    $to = filter_var($request->getParam('to'), FILTER_SANITIZE_STRING);
    if($from == null || $to == null)
            return $response->withJson(array('error'=>'Faltan datos'));
    $op = parent::ListadoVehiculosEstacionados($from,$to);
    
    if(count($op) == 0)
        return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));
    return $response->withJson($op);
  
}



public static function PromedioFacMensualApi($request, $response, $args) {
    $periodo = filter_var($request->getParam('periodo'), FILTER_SANITIZE_STRING);
    $op = parent::PromedioFacturacionMensual($periodo);
    if($op == 0)
        return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));

 
    return $response->withJson($op);
  
}
public static function PromedioAutosMensualApi($request, $response, $args) {
    $periodo = filter_var($request->getParam('periodo'), FILTER_SANITIZE_STRING);
    $op = parent::PromedioAutosMensual($periodo);
    if($op == 0)
        return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));
    return $response->withJson($op);
  
}
public static function PromedioUsuarioMensualApi($request, $response, $args) {
    $periodo = filter_var($request->getParam('periodo'), FILTER_SANITIZE_STRING);
    $op = parent::PromedioUsuarioMensual($periodo);
    if($op == 0)
        return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));
    return $response->withJson($op);
  
}



}


?>