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
public static function PromedioFacMensualApi($request, $response, $args) {
    $periodo = filter_var($request->getParam('periodo'), FILTER_SANITIZE_STRING);
    $op = parent::PromedioFacturacionMensual($periodo);
    //if(count($op) == 0)
      //  return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));
    return $response->withJson(array('importe'=>$op));
  
}



}


?>