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
    public static function PromedioFacturacionMensual($mes){
        $date = date_parse_from_format("Y-m",$mes);
        $dias = cal_days_in_month (CAL_GREGORIAN,$date['month'],$date['year']);
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        $consulta = $objDB->RetornarConsulta("SELECT SUM(pago) AS importe   FROM `operaciones` WHERE  salida IS NOT NULL AND entrada LIKE '%".$mes."%'");
        $consulta->execute();
        return $consulta->fetch(PDO::FETCH_ASSOC)['importe']/$dias;
    }
    public static function PromedioAutosMensual($mes){
        $date = date_parse_from_format("Y-m",$mes);
        $dias = cal_days_in_month (CAL_GREGORIAN,$date['month'],$date['year']);
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        $consulta = $objDB->RetornarConsulta("SELECT COUNT(patente) AS autos   FROM `operaciones` WHERE  salida IS NOT NULL AND entrada LIKE '%".$mes."%'");
        $consulta->execute();
        return $consulta->fetch(PDO::FETCH_ASSOC)['autos']/$dias;
    }
}?>
