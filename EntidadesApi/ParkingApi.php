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
        $from=$request->getParam('from');
        $to=$request->getParam('to');
        return $response->withJson(parent::LugarMasUtilizado($from,$to));
    }
    public static function LugarMenosUtilizadoApi($request, $response, $args) {
$from=$request->getParam('from');
        $to=$request->getParam('to');
        return $response->withJson(parent::LugarMenosUtilizado($from,$to));
    }
    public static function LugarNuncaUtilizadoApi($request, $response, $args) {
$from=$request->getParam('from');
        $to=$request->getParam('to');
        return $response->withJson(parent::LugarNuncaUtilizado($from,$to));
    }
}

?>