<?php
  require_once "./Entidades/AccesoDatos.php";
class  Estadistica{

    public static function Facturacion($from=null,$to=null){
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        if($from != $to)
            $consulta = $objDB->RetornarConsulta("SELECT SUM(pago) AS facturacion,COUNT(patente) AS cantidad_autos FROM `operaciones` WHERE  salida IS NOT NULL AND cast(entrada as date) BETWEEN  '".$from."' AND '".$to."'");
        elseif($from == $to)
            $consulta = $objDB->RetornarConsulta("SELECT SUM(pago) AS facturacion,COUNT(patente) AS cantidad_autos FROM `operaciones` WHERE  salida IS NOT NULL AND entrada LIKE '%".$from."%'");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_OBJ);
    }
    public static function UsoDeCocheras($from=null,$to=null){
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
    public static function ListadoVehiculosEstacionados($from=null,$to=null){
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        if($from != $to)
            $consulta = $objDB->RetornarConsulta("SELECT COUNT(patente) as cantidad FROM operaciones WHERE salida is not null and patente IN (SELECT patente FROM `autos` WHERE especial=true) AND cast(entrada as date) BETWEEN  '".$from."' AND '".$to."' GROUP BY idCochera");
        elseif($from == $to)
            $consulta = $objDB->RetornarConsulta("SELECT COUNT(patente) as cantidad FROM `operaciones` WHERE salida is not null and patente IN (SELECT patente FROM `autos` WHERE especial=true) AND entrada LIKE '%".$from."%' GROUP BY idCochera");
        $consulta->execute();
        $vehiculosTotales = $consulta->fetchAll(PDO::FETCH_OBJ);
        if($from != $to)
            $consulta = $objDB->RetornarConsulta("SELECT idcochera as cochera,COUNT(idCochera) as cantidad FROM operaciones WHERE salida is not null and patente IN (SELECT patente FROM `autos` WHERE especial=false) AND cast(entrada as date) BETWEEN  '".$from."' AND '".$to."' GROUP BY idCochera");
        elseif($from == $to)
            $consulta = $objDB->RetornarConsulta("SELECT idcochera as cochera,COUNT(idCochera) as cantidad FROM `operaciones` WHERE salida is not null and patente IN (SELECT patente FROM `autos` WHERE especial=false) AND entrada LIKE '%".$from."%' GROUP BY idCochera");
        $consulta->execute();
        $comun = $consulta->fetchAll(PDO::FETCH_OBJ);
        return array('especial'=>$especial,'comun'=>$comun);
    }

    public static function PromedioFacturacionMensual($mes){
        $date = date_parse_from_format("Y-m",$mes);
        $dias = cal_days_in_month (CAL_GREGORIAN,$date['month'],$date['year']);
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        $consulta = $objDB->RetornarConsulta("SELECT SUM(pago)/$dias AS importe   FROM `operaciones` WHERE  salida IS NOT NULL AND entrada LIKE '%".$mes."%'");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }
    public static function PromedioAutosMensual($mes){
        $date = date_parse_from_format("Y-m",$mes);
        $dias = cal_days_in_month (CAL_GREGORIAN,$date['month'],$date['year']);
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        $consulta = $objDB->RetornarConsulta("SELECT COUNT(patente)/$dias AS autos   FROM `operaciones` WHERE  salida IS NOT NULL AND entrada LIKE '%".$mes."%'");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }
    public static function PromedioUsuarioMensual($mes){
        $date = date_parse_from_format("Y-m",$mes);
        $dias = cal_days_in_month (CAL_GREGORIAN,$date['month'],$date['year']);
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        $consulta = $objDB->RetornarConsulta("SELECT idUser,count(idUser)/$dias as promedio   FROM `operaciones` WHERE  salida IS NOT NULL AND entrada LIKE '%".$mes."%' group by idUser ");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }

}?>
