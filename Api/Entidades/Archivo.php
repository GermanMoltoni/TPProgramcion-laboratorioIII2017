<?php
use Imagecow\Image;
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
    function SetLogo($path){
        $this->pathLogo = $path;
    }
    public  function CargarArchivo($request){
        $file = $request->getUploadedFiles()['file']; 
        $ext =pathinfo($file->getClientFilename(),PATHINFO_EXTENSION);
        $this->nombreArchivo=$this->nombreArchivo.'.'.$ext;
        $file->moveTo($this->pathFoto.'/tmp-'.$this->nombreArchivo);
        try{
            
            $this->ModificarImagen();
        }
        catch(Exception $e){
            return "Se excede el peso permitido";
        }
         
        
        return $this->nombreArchivo;           
    }

    public function ModificarArchivo(){
        date_default_timezone_set('America/Argentina/Buenos_Aires');

            $d=date('Y-m-d_H:i');
        $ext =pathinfo($this->pathFoto.'/'.$this->pathAnterior,PATHINFO_EXTENSION);
        $this->nombreArchivo=$this->nombreArchivo.'.'.strtolower($ext);
        //self::CopiarArchivo($this->pathFoto.'/'.$this->pathAnterior,$this->backUp.'/'.$d.'_'.$this->nombreArchivo);
        rename($this->pathFoto.'/'.$this->pathAnterior,$this->pathFoto.'/'.$this->nombreArchivo);
        return $this->nombreArchivo;
    }
    private  function VerificarDuplicado(){
        return in_array($this->nombreArchivo,scandir($this->pathFoto.'/'));
    }
    private function CopiarDuplicado(){
        date_default_timezone_set('America/Argentina/Buenos_Aires');

            $date=date('Y-m-d_H:i');
        return copy($this->pathFoto.'/'.$this->nombreArchivo,$this->backUp.'/'.$date.'_'.$this->nombreArchivo);
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
            if($files['file']->getSize() > 0)
            {
                if(round($files['file']->getSize()/pow(1024,2),0)>= 5)
                    return array('error'=>'Se excede peso de archivo');
                $ext =pathinfo($files['file']->getClientFilename(),PATHINFO_EXTENSION);
                if(!in_array($ext,array('jpg','jpeg','png','JPG','JPEG','PNG')))
                    return array('error'=>'Formato No permitido');
                else
                    return true;
            }
            return array('error'=>'No se encontro el archivo');
        }
        return array('error'=>'El archivo no pudo ser cargado');
    }
 
    private  function ModificarImagen(){
        try{
            
             $logo = Image::fromFile($this->pathLogo)->opacity(30)->resize(100,100);
             
            $image = Image::fromFile($this->pathFoto.'/tmp-'.$this->nombreArchivo)
            ->resize('50%','50%')->quality(80)->watermark($logo)->setBackground(array(0,0,0))
            ->save($this->pathFoto.'/tmp-'.$this->nombreArchivo);
            if(round(filesize($this->pathFoto.'/tmp-'.$this->nombreArchivo)/ pow(1024, 2),1) > 0.5)
                throw new Exception('Excede el tamaño permitido');
            if($this->VerificarDuplicado())
                $this->CopiarDuplicado();
            rename($this->pathFoto.'/tmp-'.$this->nombreArchivo,$this->pathFoto.'/'.$this->nombreArchivo);
         }
        catch(Exception $exception){
            if(file_exists($this->pathFoto.'/tmp-'.$this->nombreArchivo))
                unlink($this->pathFoto.'/tmp-'.$this->nombreArchivo);
            throw $exception;
        }
        return true;
        
    }
    function GetArchivo($path){
        $image = Image::fromFile($path)->show();
    }




}





?>