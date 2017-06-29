<?php
require_once './Entidades/Usuario.php';
require_once './Entidades/AuthJWT.php';
require './vendor/autoload.php';
 
class UserApi extends Usuario{
   
    public static function LoginUserApi($request, $response, $args){
        $data = $request->getParsedBody();
        $id = filter_var($data['id'], FILTER_SANITIZE_STRING);
        $password = filter_var($data['password'], FILTER_SANITIZE_STRING);
        $user = parent::LoginUsuario($id,$password);
        if($user == false)
            return $response->withJson(false);
        return $response->withJson(array('user'=>$user,'token'=>AuthJWT::CrearToken($user)));
    }
    public static function LogoutUserApi($request, $response, $args){
        $data = AuthJWT::GetData($request->getHeader('token')[0]);
        $id = filter_var($data->id, FILTER_SANITIZE_STRING);
        return $response->withJson(parent::LogoutUsuario($id));
    }
    public static function ListUsersLogApi($request, $response, $args){
            $userId = filter_var($request->getParams()['id'], FILTER_SANITIZE_STRING);
            $from = filter_var($request->getParams()['from'], FILTER_SANITIZE_STRING);
            $to = filter_var($request->getParams()['to'], FILTER_SANITIZE_STRING);
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

    public static function ListUsersApi($request, $response, $args){
        return $response->withJson(parent::ListarUsuarios());
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
        $user = new Usuario($user_data['mail'],$user_data['nombre'],$user_data['apellido'],$user_data['password'],$user_data['estado'],$user_data['turno'],$user_data['admin']);
        if($user->CrearUsuario())
            return $response->getBody()->write('registrado');
        else
            return $response->getBody()->write('ya existe');
    }


}


?>