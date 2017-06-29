<?php

class Archivo{
    //private static $backUp='./Fotos/BackUpFotos/';
    private $nombreArchivo;
    private $pathFoto;
function __construct($nombreArchivo=null,$pathFoto=null,$backUp=null){
    if($nombreArchivo!=null && $pathFoto!=null)
    {$this->nombreArchivo = $nombreArchivo;
    $this->pathFoto=$pathFoto;
    $this->backUp=$backUp;
    }
}

    public  function CargarArchivo($request){
        $file = $request->getUploadedFiles()['file']; 
        $ext =pathinfo($file->getClientFilename(),PATHINFO_EXTENSION);
        $this->nombreArchivo=$this->nombreArchivo.'.'.$ext;
        if($this->VerificarDuplicado())
            $this->CopiarDuplicado();
        $file->moveTo($this->pathFoto.'/'.$this->nombreArchivo);
        return $this->nombreArchivo;           
    }

    private  function VerificarDuplicado(){
        return in_array($this->nombreArchivo,scandir($this->pathFoto.'/'));
    }
    private function CopiarDuplicado(){
        return copy($this->pathFoto.'/'.$this->nombreArchivo,$this->backUp.'/'.$this->nombreArchivo);
    }
    public static function CopiarArchivo($origen,$dest){
        return copy($origen,$dest);
    }

    public static function VerificarArchivo($request){
        $files = $request->getUploadedFiles(); 
        if(isset($files['file']) == null)
            return false;
        if($files['file']->getError() === UPLOAD_ERR_OK)
        {
            if($files['file']->getSize() !=0)
            {
                $ext =pathinfo($files['file']->getClientFilename(),PATHINFO_EXTENSION);
                if(!in_array($ext,array('jpg','jpeg','png')))
                    return array('error'=>'Formato No permitido');
                else
                    return true;
            }
            return array('error'=>'El archivo supera el tamaño permitido');
        }
        return array('error'=>'El archivo no pudo ser cargado');
    }
}





?>