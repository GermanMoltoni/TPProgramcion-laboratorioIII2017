<?php
require_once './Entidades/AuthJWT.php';
require_once './Entidades/Usuario.php';
class AuthUser{


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
   public function verificarUsuarioDup($request, $response, $next) {
        $data = $request->getParsedBody();
        $id = filter_var($data['id'], FILTER_SANITIZE_STRING);
        $user = Usuario::BuscarUsuario($id);
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


}
?>