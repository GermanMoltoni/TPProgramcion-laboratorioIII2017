<?php
use Imagecow\Image;
require './vendor/autoload.php';
require_once './EntidadesApi/UserApi.php';
require_once './Entidades/Archivo.php';
class Imagen extends Archivo{

    function SubirImagenUsuario($request, $response, $next){
        if(!$request->getAttribute('foto'))
            return $next($request,$response);
        $datos = $request->getParsedBody();
        $id= filter_var($datos['id'], FILTER_SANITIZE_STRING);
        $nombre= filter_var($datos['name'], FILTER_SANITIZE_STRING);
        $apellido= filter_var($datos['surname'], FILTER_SANITIZE_STRING);
        $imagen = new Imagen($id.'-'.$nombre.'_'.$apellido,'./Fotos','./Fotos/BackUp');
        $pathFoto = $imagen->CargarArchivo($request);
        $image = Image::fromFile($pathFoto)->resizeCrop(80, 50, 'center', 'middle')->format('png')
                                            ->save('-small.png');
        return $next($request->withAttribute('pathFoto',$pathFoto),$response);
    }



}
?>