<?php
require_once './Entidades/AuthJWT.php';
require_once './Entidades/Usuario.php';
require_once './Entidades/Archivo.php';
class AuthUser{

public static function VerificarCamposFormUser($request, $response, $next){
        $data = $request->getParsedBody();
        if(!isset($data['mail'],$data['nombre'],$data['apellido'],$data['turno'],$data['admin'],$data['estado'],$data['password']))
            return $response->withJson(array('error'=>'Faltan Datos'));
        $user_data=array();
        $user_data['mail'] = filter_var($data['mail'], FILTER_SANITIZE_STRING);
        $user_data['nombre'] = filter_var($data['nombre'], FILTER_SANITIZE_STRING);
        $user_data['apellido'] = filter_var($data['apellido'], FILTER_SANITIZE_STRING);
        $user_data['turno'] = filter_var($data['turno'], FILTER_SANITIZE_STRING);
        $user_data['admin'] = filter_var($data['admin'], FILTER_SANITIZE_STRING);
        $user_data['estado'] = filter_var($data['estado'], FILTER_SANITIZE_STRING);
        $user_data['password'] = filter_var($data['password'], FILTER_SANITIZE_STRING);
        return $next($request->withAttribute('user',$user_data), $response);
}
public function admin($request, $response, $next) {
        try{
                if($request->getHeader('token') != null)
               {
                        AuthJWT::CheckToken($request->getHeader('token')[0]);
                        $data = AuthJWT::GetData($request->getHeader('token')[0]);
                        if($data->admin)
                                return $next($request, $response);
                        else
                                throw new Exception("El usuario no tiene permisos.");
               } 
               throw new Exception("Acceso Denegado");

        }
        catch(Exception $e)
        {
             return $response->withJson(array('error'=>$e->getMessage()));   
        }
        
        
   }
public function login($request, $response, $next) {
        try{ 
                if($request->getHeader('token') != null)
                {
                        AuthJWT::CheckToken($request->getHeader('token')[0]);
                        $data = AuthJWT::GetData($request->getHeader('token')[0]);
                        return $response->withJson(array('user'=>$data));
                }
                return $next($request,$response);

        }
        catch(Exception $e)
        {
             return $response->withJson(array('error'=>"Se requiere iniciar Sesion"));   
        }
        
        
   }
public function users($request, $response, $next) {
        try{ 
                if($request->getHeader('token') != null)
                {
                        AuthJWT::CheckToken($request->getHeader('token')[0]);
                        return $next($request, $response);
                }
                else
                        throw new Exception("Acceso Denegado");
                
                

        }
        catch(Exception $e)
        {
             return $response->withJson(array('error'=>$e->getMessage()));   
        }
        
        
   }
   public function VerificarUsuarioDup($request, $response, $next) {
        $data = $request->getParsedBody();
        $mail = filter_var($data['mail'], FILTER_SANITIZE_STRING);
        $user = Usuario::BuscarUsuarioPorMail($mail);
        if(count($user) != 0)
            return $response->withJson(array('error'=>'Usuario existente'));   
        return $next($request,$response);

   }
   public function verificarUsuario($request, $response, $next) {
        $data = $request->getParsedBody();
        $id = filter_var($data['id'], FILTER_SANITIZE_STRING);
        $user = Usuario::BuscarUsuario($id);
        if(count($user) == 0)
            return $response->withJson(array('error'=>'Usuario no existe'));   
        return $next($request,$response);

   }
   static function VerificarArchivo($request, $response, $next){
        $retorno = Archivo::VerificarArchivo($request);
        if(is_array($retorno))
            return $response->withJson($retorno,201);  
        return $next($request->withAttribute('foto',$retorno),$response);  
    }


}
?>