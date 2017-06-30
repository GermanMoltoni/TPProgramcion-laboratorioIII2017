<?php
require_once './Entidades/Usuario.php';
require_once './Entidades/AuthJWT.php';
require './vendor/autoload.php';

class UserApi extends Usuario{
   
    public static function LoginUserApi($request, $response, $args){
        $user_data = $request->getAttribute('user');
        $user = parent::LoginUsuario($user_data['mail'],$user_data['password']);
        if($user == false)
            return $response->withJson(array('error'=>'Datos incorrectos'),201);
        return $response->withJson(array('user'=>$user,'token'=>AuthJWT::CrearToken($user)));
    }

    public static function ListUsersApi($request, $response, $args){
        return $response->withJson(parent::ListarUsuarios());
    }

















    public static function LogoutUserApi($request, $response, $args){
        $data = AuthJWT::GetData($request->getHeader('token')[0]);
        $id = filter_var($data->id, FILTER_SANITIZE_STRING);
        return $response->withJson(parent::LogoutUsuario($id));
    }
    public static function ListUsersLogApi($request, $response, $args){
            $userId = filter_var($request->getParam('id'), FILTER_SANITIZE_STRING);
            $from = filter_var($request->getParam('from'), FILTER_SANITIZE_STRING);
            $to = filter_var($request->getParam('to'), FILTER_SANITIZE_STRING);
            return $response->withJson(Usuario::ListarLogsUsuario($userId,$from,$to));
    }
    public static function DownUserApi($request, $response, $args){
        $id = $request->getAttribute('id'); 
        $id = filter_var($id, FILTER_SANITIZE_STRING);
        if(Usuario::BorrarUsuario($id))
            return $response->withJson(Usuario::ListarUsuarios());
        else
            return $response->withJson(false);
    }

    public static function SuspenderUserApi($request, $response, $args) {
            $id = $request->getAttribute('id'); 
            $id = filter_var($id, FILTER_SANITIZE_STRING);
            if(Usuario::ModificarEstadoUsuario($id,0))
                return $response->withJson(Usuario::ListarUsuarios());
            else
                return $response->withJson(false);
    }

    
    
    public static function HabilitarUserApi($request, $response, $args) {
            $id = $request->getAttribute('id'); 
            $id = filter_var($id, FILTER_SANITIZE_STRING);
            if(Usuario::ModificarEstadoUsuario($id,1))
                return $response->withJson(Usuario::ListarUsuarios());
            else
                return $response->withJson(false);
    }

    public static function AltaUsuarioApi($request, $response, $args) {
        $user_data = $request->getAttribute('user');
        $path = $request->getAttribute('pathFoto');
        $user = new Usuario($user_data['mail'],$user_data['nombre'],$user_data['apellido'],$user_data['password'],$user_data['estado'],$user_data['turno'],$user_data['admin'],$path);
        if(!$user->CrearUsuario())
            return $response->withJson(array('error'=>'No se pudo crear el usuario'));
    }


}


?>