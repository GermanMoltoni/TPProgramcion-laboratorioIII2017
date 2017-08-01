<?php
  require_once "./Entidades/AccesoDatos.php";
class  Estadistica{

    public static function Facturacion($from,$to){
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        if($from != $to)
            $consulta = $objDB->RetornarConsulta("SELECT SUM(pago) AS facturacion,COUNT(patente) AS cantidad_autos FROM `operaciones` WHERE  salida IS NOT NULL AND cast(entrada as date) BETWEEN  '".$from."' AND '".$to."'");
        elseif($from == $to)
            $consulta = $objDB->RetornarConsulta("SELECT SUM(pago) AS facturacion,COUNT(patente) AS cantidad_autos FROM `operaciones` WHERE  salida IS NOT NULL AND entrada LIKE '%".$from."%'");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_OBJ);
    }
    public static function UsoDeCocheras($from,$to){
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        if($from != $to)
            $consulta = $objDB->RetornarConsulta("SELECT idcochera as cochera,COUNT(idCochera) as cantidad FROM operaciones WHERE salida is not null and patente IN (SELECT patente FROM `autos` WHERE especial=true) AND cast(entrada as date) BETWEEN  '".$from."' AND '".$to."' GROUP BY idCochera");
        elseif($from == $to)
            $consulta = $objDB->RetornarConsulta("SELECT idcochera as cochera,COUNT(idCochera) as cantidad FROM `operaciones` WHERE salida is not null and patente IN (SELECT patente FROM `autos` WHERE especial=true) AND entrada LIKE '%".$from."%' GROUP BY idCochera");
        $consulta->execute();
        $especial = $consulta->fetchAll(PDO::FETCH_OBJ);
        if($from != $to)
            $consulta = $objDB->RetornarConsulta("SELECT idcochera as cochera,COUNT(idCochera) as cantidad FROM operaciones WHERE salida is not null and patente IN (SELECT patente FROM `autos` WHERE especial=false) AND cast(entrada as date) BETWEEN  '".$from."' AND '".$to."' GROUP BY idCochera");
        elseif($from == $to)
            $consulta = $objDB->RetornarConsulta("SELECT idcochera as cochera,COUNT(idCochera) as cantidad FROM `operaciones` WHERE salida is not null and patente IN (SELECT patente FROM `autos` WHERE especial=false) AND entrada LIKE '%".$from."%' GROUP BY idCochera");
        $consulta->execute();
        $comun = $consulta->fetchAll(PDO::FETCH_OBJ);
        return array('especial'=>$especial,'comun'=>$comun);
    }
    public static function ListadoVehiculosEstacionados($from,$to){
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        if($from != $to)
            $consulta = $objDB->RetornarConsulta("SELECT DISTINCT patente FROM `operaciones` where  cast(entrada as date) BETWEEN  '".$from."' AND '".$to."'");
        elseif($from == $to)
            $consulta = $objDB->RetornarConsulta("SELECT DISTINCT patente FROM `operaciones` where entrada LIKE '%".$from."%' GROUP BY idCochera");
        $consulta->execute();
        $vehiculosDistintos = count($consulta->fetchAll(PDO::FETCH_COLUMN));
        if($from != $to)
            $consulta = $objDB->RetornarConsulta("SELECT * FROM (SELECT count(patente) as cantidad,patente FROM `operaciones` where cast(`entrada` as date) BETWEEN  '".$from."' AND '".$to."' GROUP BY `patente`) as tabla WHERE tabla.cantidad > 1");
        elseif($from == $to)
            $consulta = $objDB->RetornarConsulta("SELECT * FROM (SELECT count(patente) as cantidad,patente FROM `operaciones` where entrada like'%".$from."%'group by patente) as tabla WHERE tabla.cantidad > 1");
        $consulta->execute();
        $vehiculosRepetidos= $consulta->fetchAll(PDO::FETCH_OBJ);
        return array('repetidos'=>$vehiculosRepetidos,'distintos'=>$vehiculosDistintos);
    }

    public static function PromedioFacturacionMensual($mes,$anio){
        $dias = cal_days_in_month (CAL_GREGORIAN,$mes,$anio);
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        $consulta = $objDB->RetornarConsulta("SELECT SUM(pago)/$dias  FROM `operaciones` WHERE  salida IS NOT NULL AND entrada LIKE '%".$anio.'-'.$mes."%'");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_COLUMN)[0];
    }
    public static function PromedioAutosMensual($mes,$anio){
        $dias = cal_days_in_month (CAL_GREGORIAN,$mes,$anio);
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        $consulta = $objDB->RetornarConsulta("SELECT COUNT(patente)/$dias  FROM `operaciones` WHERE  salida IS NOT NULL AND entrada LIKE '%".$anio.'-'.$mes."%'");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_COLUMN)[0];
    }
    public static function PromedioUsuarioMensual($mes,$anio){
        $dias = cal_days_in_month (CAL_GREGORIAN,$mes,$anio);
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        $consulta = $objDB->RetornarConsulta("SELECT idUser,count(idUser)/$dias as promedio   FROM `operaciones` WHERE  salida IS NOT NULL AND entrada LIKE '%".$anio.'-'.$mes."%' group by idUser ");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }

}?>
