<?php
require_once './Entidades/Operaciones.php';
require './vendor/autoload.php';
class OperationApi extends Operacion{
    public static function ListOperationApi($request, $response, $args) {
    $userId = filter_var($request->getParams()['id'], FILTER_SANITIZE_STRING);
    $from = filter_var($request->getParams()['from'], FILTER_SANITIZE_STRING);
    $to =filter_var( $request->getParams()['to'], FILTER_SANITIZE_STRING);
    return $response->withJson(parent::ListarOperaciones($userId,$from,$to));
  
}
public static function QOperationUserApi($request, $response, $args) {

    $userId = filter_var($request->getParams()['id'], FILTER_SANITIZE_STRING);
    $from = filter_var($request->getParams()['from'], FILTER_SANITIZE_STRING);
    $to =filter_var( $request->getParams()['to'], FILTER_SANITIZE_STRING);
    return $response->withJson(parent::CantidadOperacionesPorUsuario($userId,$from,$to));
  
}



}


?>