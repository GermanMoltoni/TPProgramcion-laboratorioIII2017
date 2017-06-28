<?php

require_once './Entidades/AccesoDatos.php';
class Auto{
     
    public $patente;
    public $color;
    public $marca;
    public $especial;
    function __construct($patente=NULL,$marca=NULL,$color=NULL,$especial=NULL){
        if($patente!=NULL && $marca!=NULL && $color!=NULL && $especial != NULL)
        {  
            $this->color=$color;
            $this->marca=$marca;
            $this->patente=$patente;
            $this->especial=$especial;
        }
    } 

    /*
    *   Guarda los datos del auto en la base de datos
    *   return true si lo guardo correctamente, false si no lo hizo.
    *
    */
     function CrearAuto(){
            $objDB = AccesoDatos::DameUnObjetoAcceso();
            $consulta = $objDB->RetornarConsulta("INSERT INTO `autos`(`patente`,`color`, `marca`,`especial`) VALUES (:Patente, :Color, :Marca,:Especial)");
            $consulta->bindValue(':Patente',$this->patente, PDO::PARAM_STR);
            $consulta->bindValue(':Color',$this->color, PDO::PARAM_STR);
            $consulta->bindValue(':Especial',$this->especial, PDO::PARAM_STR);
            $consulta->bindValue(':Marca',$this->marca, PDO::PARAM_STR);
            return $consulta->execute();
        }
    /*
    *   Busca un auto en la base de datos a partir de la patente recibida
    *
    *   return Auto en caso de encontrarlo, false si no se encuentra.
    */
    static function BuscarAuto($patente)
    {
        $objDB = AccesoDatos::DameUnObjetoAcceso();
		$consulta = $objDB->RetornarConsulta("SELECT `patente`,`color`, `marca`,`especial` FROM autos WHERE `patente` = :Patente");
		$consulta->bindValue(':Patente',$patente, PDO::PARAM_STR);
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_CLASS,"auto");
    }
    


}
?>