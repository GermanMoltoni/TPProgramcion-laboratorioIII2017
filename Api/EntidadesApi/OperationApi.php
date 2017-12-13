<?php
require_once './Entidades/Operaciones.php';
require './vendor/autoload.php';
require_once './Entidades/Export.php';

class OperationApi extends Operacion{
    public static function ListOperationApi($request, $response, $args) {
                $datos = $request->getAttribute('datos');

    $export = filter_var($request->getParam('export'), FILTER_SANITIZE_STRING);

    $operaciones = parent::ListarOperaciones($datos['id'],$datos['from'],$datos['to']);
    if(count($operaciones) == 0)
        return $response->withJson(array('error'=>'No hay operaciones Cargadas'));
    if($export != null)
    {
        $file = new Export($operaciones,'Listado de Operaciones');
        if($export == 'excel')
            return $file->ToExcel($response);
        elseif($export == 'pdf')
            return $file->ToPDF($response);
    }
    return $response->withJson($operaciones);
  
}
public static function ListOperationUserApi($request, $response, $args) {
                $datos = $request->getAttribute('datos');

    $operaciones = parent::CantidadOperacionesPorUsuario($datos['id'],$datos['from'],$datos['to']);
    if(!isset($operaciones[0]->idUser) || $operaciones[0]->idUser== null)
        return $response->withJson(array('msg'=>'No hay operaciones Cargadas'));
    return $response->withJson($operaciones);
  
}



}


?>