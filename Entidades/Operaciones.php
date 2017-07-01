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

            $date=date('Y-m-d H:i:s');
		    $consulta = $objDB->RetornarConsulta("INSERT INTO `operaciones` (`idUser`,`patente`, `idCochera`,`entrada`) VALUES (:IdUser, :Patente, :IdCochera,STR_TO_DATE('".$date."',GET_FORMAT(DATETIME,'ISO')))");
		    $consulta->bindValue(':IdUser',$this->idUser, PDO::PARAM_INT);
            $consulta->bindValue(':Patente',$this->patente, PDO::PARAM_STR);
            $consulta->bindValue(':IdCochera',$this->idCochera, PDO::PARAM_INT);
            return $consulta->execute();
        }
    static function FinalizarOperacion($patente){
            $objDB = AccesoDatos::DameUnObjetoAcceso();
            $salida = self::CalcularCosto($patente);
		    $consulta = $objDB->RetornarConsulta("UPDATE `operaciones` SET `salida`=STR_TO_DATE('".$salida['date']."',GET_FORMAT(DATETIME,'ISO')), `pago`=".$salida['pago']."
            WHERE salida is NULL AND patente = :Patente");
            $consulta->bindValue(':Patente',$patente, PDO::PARAM_STR);
            $consulta->execute();
            $consulta = $objDB->RetornarConsulta("SELECT autos.patente,autos.color,autos.marca,idCochera,entrada,salida,pago,ROUND(TIMESTAMPDIFF(MINUTE, operaciones.entrada, operaciones.salida)/60,1) as tiempo FROM `operaciones`,autos where autos.patente=operaciones.patente and operaciones.patente= :Patente ORDER BY id DESC LIMIT 1");
            $consulta->bindValue(':Patente',$patente, PDO::PARAM_STR);
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_OBJ);
        }

    public function CalcularCosto($patente){
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $date=date('Y-m-d H:i:s');
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
            if($interval->format('%H')>=1)
                $minutos = (int)($interval->format('%I')/60 *10);
            if($interval->format('%H')==0)
                $hora = 10;
            else
                $hora = $interval->format('%H')*10;
        }
        return array('pago'=>$estadia+$media+$hora+$minutos,'date'=>$date);


    }
/*
(
                IF(ROUND(TIMESTAMPDIFF(MINUTE, operaciones.entrada, operaciones.salida)/60,1)< 12,
                    ROUND(TIMESTAMPDIFF(MINUTE, operaciones.entrada, operaciones.salida)/60,1)*(SELECT valor FROM tarifas WHERE tiempo='hora'),
                IF (ROUND(TIMESTAMPDIFF(MINUTE, operaciones.entrada, operaciones.salida)/60,1) >= 12 && ROUND(TIMESTAMPDIFF(MINUTE, operaciones.entrada, operaciones.salida)/60,1) <= 24,
                    (SELECT valor FROM tarifas WHERE tiempo='mediaEstadia'),(SELECT valor FROM tarifas WHERE tiempo='estadiaCompleta'))
                 ))


*/













    static function ListarOperacionesActivas()
    {
            $objDB = AccesoDatos::DameUnObjetoAcceso();
            $consulta = $objDB->RetornarConsulta("SELECT autos.patente,autos.color,autos.marca,idCochera,entrada FROM `operaciones`,autos WHERE salida is NULL AND operaciones.patente = autos.patente");
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_CLASS) ;
    }

    function  BuscarOperacionActiva($patente){
        $objDB = AccesoDatos::DameUnObjetoAcceso();
            $consulta = $objDB->RetornarConsulta("SELECT autos.patente,autos.color,autos.marca,idCochera,entrada FROM `operaciones`,autos WHERE salida is NULL AND operaciones.patente = :patente");
            		    $consulta->bindValue(':patente',$patente, PDO::PARAM_INT);
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_CLASS);
    }

    static function ListarOperaciones($userId=0,$from=null,$to=null)
    {
        $objDB = AccesoDatos::DameUnObjetoAcceso();
            if($from !=null && $to != null)
            {
                if($userId == 0)
                    $consulta = $objDB->RetornarConsulta("SELECT idUser,patente,idCochera,entrada,salida,pago,TIMEDIFF(operaciones.salida, operaciones.entrada) as tiempo FROM `operaciones` WHERE entrada  BETWEEN  '".$from."'  AND '".$to."'");
                else
                {
                    $consulta = $objDB->RetornarConsulta("SELECT idUser,patente,idCochera,entrada,salida,pago,TIMEDIFF(operaciones.salida, operaciones.entrada) as tiempo FROM `operaciones` WHERE idUser=:Id AND entrada  BETWEEN  '".$from."'  AND '".$to."'");
                    $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);

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
        if($userId == 0)
            $consulta = $objDB->RetornarConsulta("SELECT idUser,COUNT(*) as cantidad FROM `operaciones`");
        else
        {
            $consulta = $objDB->RetornarConsulta("SELECT idUser,COUNT(*) as cantidad FROM `operaciones`WHERE idUser=:Id");
            $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
        }
        $consulta->execute();
        return   $consulta->fetchAll(PDO::FETCH_OBJ);
    }



}

?>