<?php
require_once './Entidades/AuthJWT.php';
require_once './Entidades/Usuario.php';
require_once './Entidades/Archivo.php';
class AuthUser{

public static function VerificarCamposFormUser($request, $response, $next){
        $data = $request->getParsedBody();
        if(!isset($data['mail'],$data['nombre'],$data['apellido'],$data['admin'],$data['turno'],$data['estado'],$data['password']))
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
public static function VerificarModifFormUser($request, $response, $next){
        $data = $request->getParsedBody();
        if(!isset($data['id'],$data['mail'],$data['nombre'],$data['apellido'],$data['admin'],$data['turno'],$data['estado'],$data['password']))
            return $response->withJson(array('error'=>'Faltan Datos'));
        $user_data=array();
                $user_data['id'] = filter_var($data['id'], FILTER_SANITIZE_STRING);

        $user_data['mail'] = filter_var($data['mail'], FILTER_SANITIZE_STRING);
        $user_data['nombre'] = filter_var($data['nombre'], FILTER_SANITIZE_STRING);
        $user_data['apellido'] = filter_var($data['apellido'], FILTER_SANITIZE_STRING);
        $user_data['turno'] = filter_var($data['turno'], FILTER_SANITIZE_STRING);
        $user_data['admin'] = filter_var($data['admin'], FILTER_SANITIZE_STRING);
        $user_data['estado'] = filter_var($data['estado'], FILTER_SANITIZE_STRING);
        $user_data['password'] = filter_var($data['password'], FILTER_SANITIZE_STRING);
        return $next($request->withAttribute('user',$user_data), $response);
}
public static function VerificarFormLogin($request, $response, $next){
        $data = $request->getParsedBody();
        if(!isset($data['mail'],$data['password']))
            return $response->withJson(array('error'=>'Faltan Datos'));
        $user_data=array();
        $user_data['mail'] = filter_var($data['mail'], FILTER_SANITIZE_STRING);
        $user_data['password'] = filter_var($data['password'], FILTER_SANITIZE_STRING);
        return $next($request->withAttribute('user',$user_data), $response);
}
public static function VerificarFormIngreso($request, $response, $next){
        $data = $request->getParsedBody();
        if(!isset($data['patente'],$data['marca'],$data['color'],$data['especial']))
            return $response->withJson(array('error'=>'Faltan Datos'));
        $vehiculo=array();
        $vehiculo['patente'] = filter_var($data['patente'], FILTER_SANITIZE_STRING);
        $vehiculo['marca'] = filter_var($data['marca'], FILTER_SANITIZE_STRING);
        $vehiculo['color'] = filter_var($data['color'], FILTER_SANITIZE_STRING); 
        $vehiculo['especial'] = filter_var($data['especial'], FILTER_SANITIZE_STRING);
        return $next($request->withAttribute('vehiculo',$vehiculo), $response);
}




public function admin($request, $response, $next) {
        try{
                if($request->getHeader('token') != null)
               {
                        AuthJWT::CheckToken($request->getHeader('token')[0]);
                        $data = AuthJWT::GetData($request->getHeader('token')[0]);
                        if($data->admin)
                                return $next($request->withAttribute('idAdm',$data->id), $response);
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
                elseif($request->getHeader('token') == null)
                    return $next($request,$response);

        }
        catch(Exception $e)
        {   
             return  $response->withJson(array('error'=>"Se requiere iniciar Sesion"));   
        }
        
        
   }
public function users($request, $response, $next) {
        try{ 
                if($request->getHeader('token') != null)
                {
                        AuthJWT::CheckToken($request->getHeader('token')[0]);
                        $data = AuthJWT::GetData($request->getHeader('token')[0]);

                        return $next($request->withAttribute('idUser',$data->id), $response);
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
            return $response->withJson(array('error'=>'Usuario existente'),201);   
        return $next($request,$response);

   }
   public static function verificarModificacionUsuario($request, $response, $next){
        $user = Usuario::BuscarUsuarioPorMail($request->getAttribute('user')['mail']);
        if(isset($user[0]))
        {
            $user=$user[0];
            if($user->id != $request->getAttribute('id'))
                return $response->withJson(array('error'=>'Otro usuario tiene el mismo mail'),201);
        }
        return $next($request,$response);

    }
   public function verificarUsuario($request, $response, $next){
        $data = $request->getParsedBody();
        if(isset($data['id']))
            $id = filter_var($data['id'], FILTER_SANITIZE_STRING);
        elseif($request->getParam('id') != null){
            $id = filter_var($request->getParam('id'), FILTER_SANITIZE_STRING);
        }
        else
            return $response->withJson(array('error'=>'Dato incorrecto'),201);
        $user = Usuario::BuscarUsuarioPorId($id);
        if(count($user) == 0)
            return $response->withJson(array('error'=>'Usuario no existe'),201); 
        $user=$user[0];  
        return $next($request->withAttribute('id',$user->id),$response);

   }
   static function VerificarArchivo($request, $response, $next){
        $retorno = Archivo::VerificarArchivo($request);
        if(is_array($retorno))
            return $response->withJson($retorno,201);  
        return $next($request->withAttribute('foto',$retorno),$response);  
    }

    static function verificarFormTiempo($request, $response, $next){
        $date = '/\d{4}-\d{2}-\d{2}$/';
        $datetime =  '/\d{4}-\d{2}-\d{2}\h\d{2}:\d{2}:\d{2}$/';
        $from=$to=$id=null;
        $id = filter_var($request->getParam('id'), FILTER_SANITIZE_STRING);
        $from = filter_var($request->getParam('from'), FILTER_SANITIZE_STRING);
        $to = filter_var($request->getParam('to'), FILTER_SANITIZE_STRING);
        if( $from ==null && $to == null)
            return $next($request->withAttribute('datos',array('id'=>$id,'from'=>$from,'to'=>$to)),$response);
        if( preg_match($date,$from) && preg_match($date,$to) ||preg_match($datetime,$from) && preg_match($datetime,$to))
        {

             try{
                $fromD = new DateTime($from);
            $toD = new DateTime($to);
            }
            catch(Exception $e){
                return $response->withJson(array('error'=>'Fecha incorrecta'),201); 

            }
            if($fromD > $toD)
                return $response->withJson(array('error'=>'Rango de fecha incorrecto'),201); 
            return $next($request->withAttribute('datos',array('id'=>$id,'from'=>$from,'to'=>$to)),$response);
        }
        elseif (preg_match($date,$from) || preg_match($datetime,$from)) 
            return $next($request->withAttribute('datos',array('id'=>$id,'from'=>$from,'to'=>$to)),$response);

        return $response->withJson(array('error'=>'Formato de fecha incorrecto'),201); 
        
    }
      static function verificarFechas($request, $response, $next){
        $date = '/\d{4}-\d{2}-\d{2}$/';
        $datetime =  '/\d{4}-\d{2}-\d{2}\h\d{2}:\d{2}:\d{2}$/';
        $from=$to=null;
        $from = filter_var($request->getParam('from'), FILTER_SANITIZE_STRING);
        $to = filter_var($request->getParam('to'), FILTER_SANITIZE_STRING);
        if($from ==null || $to == null)
            return $response->withJson(array('error'=>'FaltanDatos'),201); 
        if( preg_match($date,$from) && preg_match($date,$to) ||preg_match($datetime,$from) && preg_match($datetime,$to))
        {
            try{
                $fromD = new DateTime($from);
            $toD = new DateTime($to);
            }
            catch(Exception $e){
                return $response->withJson(array('error'=>'Fecha incorrecta'),201); 

            }
            
            if($fromD > $toD)
                return $response->withJson(array('error'=>'Rango de fecha incorrecto'),201); 
            return $next($request->withAttribute('datos',array('from'=>$from,'to'=>$to)),$response);
        }
        return $response->withJson(array('error'=>'Formato de fecha incorrecto'),201); 
        
    }
        static function verificarPromedioTiempo($request, $response, $next){
        $date = '/\d{4}-\d{2}$/';
        $periodo=null;
        $periodo = filter_var($request->getParam('periodo'), FILTER_SANITIZE_STRING);
        if( $periodo == null)
            return $response->withJson(array('error'=>'Faltan datos'),201); 
        if( preg_match($date,$periodo))
        {
            $date = DateTime::createFromFormat("Y-m", $periodo);
            $mes=$date->format('m');
            $anio = $date->format('Y');
            if($anio > '0000' || $mes >'00')
                return $next($request->withAttribute('periodo',array('mes'=>$mes,'anio'=>$anio)),$response);
            else
                return $response->withJson(array('error'=>'Fecha no valida'),201); 

        }
        return $response->withJson(array('error'=>'Formato de fecha incorrecto'),201); 
        
    }
}
?>