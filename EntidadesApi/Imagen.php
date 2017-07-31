<?php
use Imagecow\Image;
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
        $pathFoto = $imagen->CargarArchivo($request);
        self::MarcaDeAgua('./Fotos/'.$pathFoto,'./utn_logo.jpg');
        try{
            self::ModificarImagen('./Fotos/'.$pathFoto);
        }
        catch(Exception $e){
            return $response->withJson("Se excede el tamaño permitido",201);  
        }
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
            self::MarcaDeAgua('./Fotos/'.$pathFoto,'./utn_logo.jpg');
           
            return $next($request->withAttribute('pathFoto',$pathFoto),$response);
        }
        if(!$request->getAttribute('foto'))
            return $next($request,$response);
        $imagen = new Imagen($mail,'./Fotos','./Fotos/BackUp');
        $pathFoto = $imagen->CargarArchivo($request);
        self::MarcaDeAgua('./Fotos/'.$pathFoto,'./utn_logo.jpg');

        return $next($request->withAttribute('pathFoto',$pathFoto),$response);
    }

    private static function MarcaDeAgua($pathImagen,$pathLogo){
        $imagen = Image::fromFile($pathImagen);
        $logo = Image::fromFile($pathLogo);
        $logo->opacity(30);
        $imagen->watermark($logo)->save();
    }
    private static function ModificarImagen($path){
        try{
            $image = Image::fromFile($path)
            ->resize('50%','50%')->quality(80)
            ->save($path);
            if(round(filesize('tmp'.$path)/ pow(1024, 2),1) > 0.5)
                throw new Exception("Se excede del tamaño permitido");
            unlink($path);
            rename('tmp'.$path,$path);
            unlink('tmp'.$path);
        }
        catch(Exception $exception){
            if(file_exists($path))
                unlink($path);
            throw $exception;
        }
        return true;
        
    }


}
?>