<?php

require_once './Entidades/Estacionamiento.php';

require './vendor/autoload.php';

class ParkingApi extends Estacionamiento{
    public static function ParkCarApi($request, $response, $args) {
        $vehiculo = $request->getAttribute('vehiculo');
        $idUser = $request->getAttribute('idUser');
        $auto = new Auto($vehiculo['patente'],$vehiculo['marca'],$vehiculo['color'],$vehiculo['especial']);
        return $response->withJson(parent::Estacionar($auto,$idUser));
    }
    public static function RemoveCarApi($request, $response, $args) {
        $patente = $request->getAttribute('patente'); 
        return $response->withJson(parent::RetirarAuto(filter_var($patente, FILTER_SANITIZE_STRING)));
    }
    public static function LugarMasUtilizadoApi($request, $response, $args) {
                        $datos = $request->getAttribute('datos');

        $op = parent::LugarMasUtilizado($datos['from'],$datos['to']);
        if(count($op) == 0 )
            return $response->withJson(array('msg'=>'No hay registro de datos en la fecha indicada'));
        return $response->withJson($op);
    }
    public static function LugarMenosUtilizadoApi($request, $response, $args) {
                    $datos = $request->getAttribute('datos');

        $op = parent::LugarMenosUtilizado($datos['from'],$datos['to']);
        if(count($op) == 0 )
            return $response->withJson(array('msg'=>'No hay registro de datos en la fecha indicada'));
        return $response->withJson($op);
    }
    public static function LugarNuncaUtilizadoApi($request, $response, $args) {
                $datos = $request->getAttribute('datos');

        $op = parent::LugarNuncaUtilizado($datos['from'],$datos['to']);
        if(count($op) == 0 )
            return $response->withJson(array('msg'=>'No hay registro de datos en la fecha indicada'));
        return $response->withJson($op);
    }
}

?>