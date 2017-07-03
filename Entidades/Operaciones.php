<?php
    require_once "./Entidades/AccesoDatos.php";

class Operacion{
    public $idUser;
    public $patente;
    public $idCochera;
    public $entrada;
    public $salida;
    public $pago;
    public $tiempo;
    function __construct($idUser=NULL,$patente=NULL,$idCochera=NULL,$entrada=NULL,$salida=NULL,$pago=NULL,$tiempo=NULL){
        if($idUser != NULL && $patente != NULL && $idCochera != NULL)
        {
            $this->idUser=$idUser;
            $this->idCochera=$idCochera;
            $this->patente=$patente;
            $this->entrada=$entrada;
            $this->salida=$salida;
            $this->pago=$pago;
            $this->tiempo=$tiempo;
        }
    }
    function IniciarOperacion(){
            $objDB = AccesoDatos::DameUnObjetoAcceso();
                    date_default_timezone_set('America/Argentina/Buenos_Aires');

            $date=date('Y-m-d H:i');
		    $consulta = $objDB->RetornarConsulta("INSERT INTO `operaciones` (`idUser`,`patente`, `idCochera`,`entrada`) VALUES (:IdUser, :Patente, :IdCochera,STR_TO_DATE('".$date."',GET_FORMAT(DATETIME,'ISO')))");
		    $consulta->bindValue(':IdUser',$this->idUser, PDO::PARAM_INT);
            $consulta->bindValue(':Patente',$this->patente, PDO::PARAM_STR);
            $consulta->bindValue(':IdCochera',$this->idCochera, PDO::PARAM_INT);
            return $consulta->execute();
        }

    static function FinalizarOperacion($patente){
            $objDB = AccesoDatos::DameUnObjetoAcceso();
            $operacion = self::CalcularCosto($patente);
		    $consulta = $objDB->RetornarConsulta("UPDATE `operaciones` SET `salida`=STR_TO_DATE('".$operacion->salida."',GET_FORMAT(DATETIME,'ISO')), `pago`=".$operacion->pago."
            WHERE salida is NULL AND patente = :Patente");
            $consulta->bindValue(':Patente',$patente, PDO::PARAM_STR);
            $consulta->execute();
            return $operacion;
        }
        /*
    *   Calcula el costo del tiempo de estacionamiento del auto
    *   patente: patente del auto estacionado
    *   return operacion completa con datos
    *
    */
    public function CalcularCosto($patente){
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $date=date('Y-m-d H:i');
        $operacion = self::BuscarOperacionActiva($patente)[0];
        $entrada = new DateTime($operacion->entrada);
        $salida = new DateTime($date);
        $interval = $entrada->diff($salida);
        $estadia=$media=$hora=$minutos=0;
        if($interval->format('%a') > 0)
            $estadia = $interval->format('%a')*110;
        if($interval->format('%H')>=12)
            $media = 70;
        if($interval->format('%H')>=0 && $interval->format('%H')<12)
        {
                
            if($interval->format('%H')==0)
                $hora = 10;
            elseif($interval->format('%H')>=1)
            {
                $minutos = (int)($interval->format('%I')/60 *10);
                $hora = $interval->format('%H')*10;

            }

        }
        $operacion->salida = $date;
        $operacion->pago = $estadia+$media+$hora+$minutos;
        $operacion->tiempo = $interval->format('D: %a Hs: %H Min:%I ');
        return $operacion;
    }














    static function ListarOperacionesActivas()
    {
            $objDB = AccesoDatos::DameUnObjetoAcceso();
            $consulta = $objDB->RetornarConsulta("SELECT autos.patente,autos.color,autos.marca,idCochera,entrada FROM `operaciones`,autos WHERE salida is NULL AND operaciones.patente = autos.patente ORDER BY idCochera");
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_CLASS) ;
    }

    function  BuscarOperacionActiva($patente){
        $objDB = AccesoDatos::DameUnObjetoAcceso();
            $consulta = $objDB->RetornarConsulta("SELECT autos.patente,autos.color,autos.marca,idCochera,entrada FROM `operaciones`,autos WHERE salida is NULL AND operaciones.patente = autos.patente AND autos.patente=:patente");
            		    $consulta->bindValue(':patente',$patente, PDO::PARAM_INT);
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_CLASS);
    }

    static function ListarOperaciones($userId=0,$from=null,$to=null)
    {
        $objDB = AccesoDatos::DameUnObjetoAcceso();
            if($from !=null && $to != null)
            {
                if(self::checkDateOrDateTime($from) && self::checkDateOrDateTime($to))
                {
                    if($userId == 0)
                       $consulta = $objDB->RetornarConsulta("SELECT idUser,patente,idCochera,entrada,salida,pago,TIMEDIFF(operaciones.salida, operaciones.entrada) as tiempo FROM `operaciones` WHERE cast(entrada as date)  BETWEEN  '".$from."' AND '".$to."'");
                    else
                    {
                        $consulta = $objDB->RetornarConsulta("SELECT idUser,patente,idCochera,entrada,salida,pago,TIMEDIFF(operaciones.salida, operaciones.entrada) as tiempo FROM `operaciones` WHERE idUser=:Id AND cast(entrada as date)  BETWEEN  '".$from."'  AND '".$to."'");
                        $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
                    }
                }
                else
                {
                    if($userId == 0)
                       $consulta = $objDB->RetornarConsulta("SELECT idUser,patente,idCochera,entrada,salida,pago,TIMEDIFF(operaciones.salida, operaciones.entrada) as tiempo FROM `operaciones` WHERE cast(entrada as datetime)  BETWEEN  '".$from."' AND '".$to."'");
                    else
                    {
                        $consulta = $objDB->RetornarConsulta("SELECT idUser,patente,idCochera,entrada,salida,pago,TIMEDIFF(operaciones.salida, operaciones.entrada) as tiempo FROM `operaciones` WHERE idUser=:Id AND cast(entrada as datetime)  BETWEEN  '".$from."'  AND '".$to."'");
                        $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
                    }
                }
                
            }
            elseif($from !=null)
            {
                if($userId == 0)
                {
                    $consulta = $objDB->RetornarConsulta("SELECT idUser,patente,idCochera,entrada,salida,pago,TIMEDIFF(operaciones.salida, operaciones.entrada) as tiempo FROM `operaciones` WHERE  entrada   LIKE '%".$from."%'");
                }
                else
                {
                    $consulta = $objDB->RetornarConsulta("SELECT idUser,patente,idCochera,entrada,salida,pago,TIMEDIFF(operaciones.salida, operaciones.entrada) as tiempo FROM `operaciones` WHERE idUser=:Id AND entrada   LIKE '%".$from."%'");
                    $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
                }
            }
            elseif($userId!=0)
            {
                $consulta = $objDB->RetornarConsulta("SELECT idUser,patente,idCochera,entrada,salida,pago,TIMEDIFF(operaciones.salida, operaciones.entrada) as tiempo FROM `operaciones`WHERE idUser=:Id");
                $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
            }
            else
                $consulta = $objDB->RetornarConsulta("SELECT idUser,patente,idCochera,entrada,salida,pago,TIMEDIFF(operaciones.salida, operaciones.entrada) as tiempo FROM `operaciones`");
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_CLASS,"operacion");


    }
    static function CantidadOperacionesPorUsuario($userId=0,$from=null,$to=null){
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        if($from !=null && $to != null)
            {
                if(self::checkDateOrDateTime($from) && self::checkDateOrDateTime($to))
                {
                    if($userId == 0)
                        $consulta = $objDB->RetornarConsulta("SELECT idUser,COUNT(*) as cantidad FROM `operaciones` WHERE cast(entrada as date)  BETWEEN  '".$from."'  AND '".$to."' GROUP BY idUser");
                    else{
                        $consulta = $objDB->RetornarConsulta("SELECT idUser,COUNT(*) as cantidad FROM `operaciones` WHERE idUser=:Id AND cast(entrada as date)  BETWEEN  '".$from."'  AND '".$to."'");
                        $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
                    }
                }
                else
                {
                    if($userId == 0)
                        $consulta = $objDB->RetornarConsulta("SELECT idUser,COUNT(*) as cantidad FROM `operaciones` WHERE cast(entrada as datetime)  BETWEEN  '".$from."'  AND '".$to."' GROUP BY idUser");
                    else{
                        $consulta = $objDB->RetornarConsulta("SELECT idUser,COUNT(*) as cantidad FROM `operaciones` WHERE idUser=:Id AND cast(entrada as datetime)  BETWEEN  '".$from."'  AND '".$to."'");
                        $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
                    }
                }
            }
            elseif($from !=null)
            {
                if($userId == 0)
                    $consulta = $objDB->RetornarConsulta("SELECT idUser,COUNT(*) as cantidad FROM `operaciones` WHERE  entrada   LIKE '%".$from."%' GROUP BY idUser");
                else
                {
                    $consulta = $objDB->RetornarConsulta("SELECT idUser,COUNT(*) as cantidad FROM `operaciones` WHERE  idUser=:Id AND entrada LIKE '%".$from."%'");
                    $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
                }
            }
            elseif($userId!=0)
            {
                $consulta = $objDB->RetornarConsulta("SELECT idUser,COUNT(*) as cantidad FROM `operaciones` WHERE idUser=:Id ");
                $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
            }
            else
                $consulta = $objDB->RetornarConsulta("SELECT idUser,COUNT(*) as cantidad FROM `operaciones` GROUP BY idUser");
        $consulta->execute();
        return   $consulta->fetchAll(PDO::FETCH_OBJ);
    }

private static function checkDateOrDateTime($var){
    if(preg_match('/\d{4}-\d{2}-\d{2}$/',$var))
        return 1;   
    elseif(preg_match('/\d{4}-\d{2}-\d{2}\h\d{2}:\d{2}:\d{2}$/',$var))
        return 0;   
    
}

}
