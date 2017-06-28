<?php

require_once './Entidades/Estacionamiento.php';

require './vendor/autoload.php';

class ParkingApi extends Estacionamiento{
    public static function ParkCarApi($request, $response, $args) {
        $data = $request->getParsedBody();
        $user_data=array();
        $user_data['patente'] = filter_var($data['patente'], FILTER_SANITIZE_STRING);
        $user_data['marca'] = filter_var($data['marca'], FILTER_SANITIZE_STRING);
        $user_data['color'] = filter_var($data['color'], FILTER_SANITIZE_STRING); 
        $user_data['especial'] = filter_var($data['especial'], FILTER_SANITIZE_STRING);
        $auto = new Auto($user_data['patente'],$user_data['marca'],$user_data['color'],$user_data['especial']);
        return $response->withJson(parent::Estacionar($auto,1));
    }
    public static function RemoveCarApi($request, $response, $args) {
        $patente = $request->getAttribute('patente'); 
        return $response->withJson(parent::RetirarAuto(filter_var($patente, FILTER_SANITIZE_STRING)));
    }
    public static function LugarMasUtilizadoApi($request, $response, $args) {

        return $response->withJson(parent::LugarMasUtilizado());
    }
    public static function LugarMenosUtilizadoApi($request, $response, $args) {

        return $response->withJson(parent::LugarMenosUtilizado());
    }
    public static function LugarNuncaUtilizadoApi($request, $response, $args) {

        return $response->withJson(parent::LugarNuncaUtilizado());
    }
}

?>