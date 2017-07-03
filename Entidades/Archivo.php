<?php

class Archivo{
    private $nombreArchivo;
    private $pathFoto;
    private $pathAnterior;
    private $backUp;
function __construct($nombreArchivo=null,$pathFoto=null,$backUp=null,$pathAnterior=null){
    if($nombreArchivo!=null && $pathFoto!=null)
    {$this->nombreArchivo = $nombreArchivo;
    $this->pathFoto=$pathFoto;
    $this->backUp=$backUp;
    $this->pathAnterior=$pathAnterior;
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
    public function ModificarArchivo(){
        $ext =pathinfo($this->pathFoto.'/'.$this->pathAnterior,PATHINFO_EXTENSION);
        $this->nombreArchivo=$this->nombreArchivo.'.'.$ext;
        self::CopiarArchivo($this->pathFoto.'/'.$this->pathAnterior,$this->backUp.'/'.$this->nombreArchivo);
        rename($this->pathFoto.'/'.$this->pathAnterior,$this->pathFoto.'/'.$this->nombreArchivo);
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