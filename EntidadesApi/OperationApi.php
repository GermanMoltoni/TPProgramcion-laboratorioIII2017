<?php
require_once './Entidades/Operaciones.php';
require './vendor/autoload.php';
require_once './EntidadesApi/Export.php';

class OperationApi extends Operacion{
    public static function ListOperationApi($request, $response, $args) {
    $userId = filter_var($request->getParam('id'), FILTER_SANITIZE_STRING);
    $from = filter_var($request->getParam('from'), FILTER_SANITIZE_STRING);
    $to = filter_var($request->getParam('to'), FILTER_SANITIZE_STRING);
    $export = filter_var($request->getParam('export'), FILTER_SANITIZE_STRING);

    $operaciones = parent::ListarOperaciones($userId,$from,$to);
    if(count($operaciones) == 0)
        return $response->withJson(array('error'=>'No hay operaciones Cargadas'));
    if($export != null)
    {
        $file = new Export($operaciones,'Listado de Operaciones');
        if($export == 'excel')
            $file->ToExcel();
        elseif($export == 'pdf')
            $file->ToPDF();
    }
    return $response->withJson($operaciones);
  
}
public static function ListOperationUserApi($request, $response, $args) {

    $userId = filter_var($request->getParam('id'), FILTER_SANITIZE_STRING);
    $from = filter_var($request->getParam('from'), FILTER_SANITIZE_STRING);
    $to = filter_var($request->getParam('to'), FILTER_SANITIZE_STRING);
    $operaciones = parent::CantidadOperacionesPorUsuario($userId,$from,$to);
    if($operaciones[0]->idUser == null)
        return $response->withJson(array('error'=>'No hay operaciones Cargadas'));
    return $response->withJson($operaciones);
  
}



}


?>