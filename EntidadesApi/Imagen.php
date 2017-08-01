<?php

require './vendor/autoload.php';
require_once './EntidadesApi/UserApi.php';
require_once './Entidades/Archivo.php';
class Imagen extends Archivo{

    function SubirImagenUsuario($request, $response, $next){
        if(!$request->getAttribute('foto'))
            return $next($request,$response);
        $datos = $request->getParsedBody('user');
        $mail= filter_var($datos['mail'], FILTER_SANITIZE_STRING);
        $imagen = new Imagen($mail,'./Fotos','./Fotos/BackUp');
        $imagen->SetLogo('./utn_logo.jpg');
        $pathFoto = $imagen->CargarArchivo($request);
      
        return $next($request->withAttribute('pathFoto',$pathFoto),$response);
    }
    function ModificarImagenUsuario($request, $response, $next){
        $datos = $request->getParsedBody('user');
        $mail= filter_var($datos['mail'], FILTER_SANITIZE_STRING);
        $user = UserApi::BuscarUsuarioPorId($request->getAttribute('id'))[0];
        
        if($user->mail != $mail && $user->pathFoto != null)
        {
            $imagen = new Imagen($mail,'./Fotos','./Fotos/BackUp',$user->pathFoto);
            $pathFoto = $imagen->ModificarArchivo(); 
            return $next($request->withAttribute('pathFoto',$pathFoto),$response);
        }
        if(!$request->getAttribute('foto'))
            return $next($request,$response);
        $imagen = new Imagen($mail,'./Fotos','./Fotos/BackUp');
        $imagen->SetLogo('./utn_logo.jpg');
        $pathFoto = $imagen->CargarArchivo($request);
        return $next($request->withAttribute('pathFoto',$pathFoto),$response);
    }

        function GetImagenMail($request, $response, $next){
        $mail = filter_var($request->getParam('mail'), FILTER_SANITIZE_STRING);
        if($mail != null || $mail != ''){
            $user = UserApi::BuscarUsuarioPorMail($mail);
            if(count($user) != 0 )
            {
                if($user->pathFoto != null)
                    self::GetArchivo('./Fotos'.$user->pathFoto);

            }
        }    
            
        }
    


}
?>