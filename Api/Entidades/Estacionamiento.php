<?php
require_once './Entidades/Auto.php';
require_once './Entidades/Piso.php';

class Estacionamiento{

    /*
    *   Ingresa un auto al estacionamiento.
    *   vehiculo: Auto a estacionar
    *   userId: id del usuario que lo atiende.
    *   return : numero de cochera si se pudo estacionar.
    *           error: si no hay lugar o si ya se encuentra estacionado.
    */
    static function Estacionar($vehiculo,$userId){
        if($vehiculo->especial === '0')
            $cochera = Piso::ObtenerLugar();
        else
            $cochera = Piso::ObtenerLugarEspecial();
        if($cochera != false)
        {
            $auto = Auto::BuscarAuto($vehiculo->patente);
            if(count($auto) == 0)
                $vehiculo->CrearAuto();
            else
                $vehiculo = $auto[0];
            if(Estacionamiento::VerificarAutoEstacionado($vehiculo->patente) == false)
            {
                $operacion = new Operacion($userId,$vehiculo->patente,$cochera);
                if($operacion->IniciarOperacion())
                    return array('cochera'=>$cochera);
            }
            return array('error'=>'El Vehiculo se encuentra estacionado');
        }
        return array('error'=>'No hay lugar');
    }
    /*
    *   Verifica si el auto se enceuntra estacionado.
    *   return: nro de cochera si lo esta, false si no.
    */
     static function VerificarAutoEstacionado($patente)
    {
        $objDB = AccesoDatos::DameUnObjetoAcceso();
		$consulta = $objDB->RetornarConsulta("SELECT `idCochera` FROM operaciones WHERE salida is NULL AND `patente` = :Patente");
		$consulta->bindValue(':Patente',$patente, PDO::PARAM_STR);
        $consulta->execute();
        return $consulta->fetch();
    }
    /*
    *   Retira el auto del estacionamiento
    *   return :error si no se encuentra el auto
    *   return : datos de la operacion.
    *
    */
    static function RetirarAuto($patente){
        
        if(Operacion::BuscarOperacionActiva($patente) !=false)
            return Operacion::FinalizarOperacion($patente);
        else
            return array('error'=>'El vehiculo no se encuentra estacionado');
    }
    /*
    *   Retorna el lugar mas utilizado junto a la cantidad de veces.
    *   from: Fecha desde
    *   to: Fecha Hasta
    *
    */
    static function LugarMasUtilizado($from=null,$to=null){
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        if($from != null && $to!=null)
        {
            if(self::checkDateOrDateTime($from) && self::checkDateOrDateTime($to))
                $consulta = $objDB->RetornarConsulta("SELECT s.idCochera as cochera,s.veces as veces FROM (SELECT idCochera,count(*) as veces FROM operaciones  WHERE cast(entrada  as date) BETWEEN '".$from."' AND '".$to."' GROUP BY idCochera) as s where s.veces IN (SELECT MAX(o.veces) FROM(SELECT idCochera,count(*) as veces FROM operaciones  WHERE cast(entrada  as date) BETWEEN '".$from."' AND '".$to."' GROUP BY idCochera) as o)");
            else
                $consulta = $objDB->RetornarConsulta("SELECT s.idCochera as cochera,s.veces as veces FROM (SELECT idCochera,count(*) as veces FROM operaciones  WHERE cast(entrada  as datetime) BETWEEN '".$from."' AND '".$to."' GROUP BY idCochera) as s where s.veces IN (SELECT MAX(o.veces) FROM(SELECT idCochera,count(*) as veces FROM operaciones  WHERE cast(entrada  as datetime) BETWEEN '".$from."' AND '".$to."' GROUP BY idCochera) as o)");

        }
        elseif ($from != null) 
            $consulta = $objDB->RetornarConsulta("SELECT s.idCochera as cochera,s.veces as veces FROM (SELECT idCochera,count(*) as veces FROM operaciones  WHERE entrada LIKE '%".$from."%'  GROUP BY idCochera) as s where s.veces IN (SELECT MAX(o.veces) FROM(SELECT idCochera,count(*) as veces FROM operaciones  WHERE entrada LIKE '%".$from."%'  GROUP BY idCochera) as o)");
        else
            $consulta = $objDB->RetornarConsulta("SELECT s.idCochera as cochera,s.veces as veces FROM (SELECT idCochera,count(*) as veces FROM operaciones GROUP BY idCochera) as s where s.veces IN (SELECT MAX(o.veces) FROM(SELECT idCochera,count(*) as veces FROM operaciones GROUP BY idCochera) as o)");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_OBJ);
        
    }
    /*
    *   Retorna el lugar menos utilizado junto a la cantidad de veces.
    *   from: Fecha desde
    *   to: Fecha Hasta
    *
    */
    static function LugarMenosUtilizado($from=null,$to=null){
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        if($from != null && $to!=null)
        {
            if(self::checkDateOrDateTime($from) && self::checkDateOrDateTime($to))
                $consulta = $objDB->RetornarConsulta("SELECT s.idCochera as cochera,s.veces as veces FROM (SELECT idCochera,count(*) as veces FROM operaciones WHERE cast(entrada  as date) BETWEEN '".$from."' AND '".$to."'  GROUP BY idCochera) as s where s.veces IN (SELECT MIN(o.veces) FROM(SELECT idCochera,count(*) as veces FROM operaciones WHERE cast(entrada  as date) BETWEEN '".$from."' AND '".$to."' GROUP BY idCochera) as o)");
            else
                $consulta = $objDB->RetornarConsulta("SELECT s.idCochera as cochera,s.veces as veces FROM (SELECT idCochera,count(*) as veces FROM operaciones WHERE cast(entrada  as datetime) BETWEEN '".$from."' AND '".$to."'  GROUP BY idCochera) as s where s.veces IN (SELECT MIN(o.veces) FROM(SELECT idCochera,count(*) as veces FROM operaciones WHERE cast(entrada  as datetime) BETWEEN '".$from."' AND '".$to."' GROUP BY idCochera) as o)");

        }   
         elseif ($from != null) 
            $consulta = $objDB->RetornarConsulta("SELECT s.idCochera as cochera,s.veces as veces FROM (SELECT idCochera,count(*) as veces FROM operaciones WHERE entrada LIKE '%".$from."%'   GROUP BY idCochera) as s where s.veces IN (SELECT MIN(o.veces) FROM(SELECT idCochera,count(*) as veces FROM operaciones WHERE entrada LIKE '%".$from."%'  GROUP BY idCochera) as o)");
        else
            $consulta = $objDB->RetornarConsulta("SELECT s.idCochera as cochera,s.veces as veces FROM (SELECT idCochera,count(*) as veces FROM operaciones GROUP BY idCochera) as s where s.veces IN (SELECT MIN(o.veces) FROM(SELECT idCochera,count(*) as veces FROM operaciones GROUP BY idCochera) as o)");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_OBJ);
    }
    /*
    *   Retorna el lugar nunca  utilizado junto a la cantidad de veces.
    *   from: Fecha desde
    *   to: Fecha Hasta
    *
    */
    static function LugarNuncaUtilizado($from=null,$to=null){
        $objDB = AccesoDatos::DameUnObjetoAcceso();
        if($from != null && $to!=null)
        {         
            if(self::checkDateOrDateTime($from) && self::checkDateOrDateTime($to))   
                $consulta = $objDB->RetornarConsulta("SELECT idCochera FROM operaciones WHERE cast(entrada  as date) BETWEEN '".$from."' AND '".$to."' GROUP BY idCochera");
            else
                $consulta = $objDB->RetornarConsulta("SELECT idCochera FROM operaciones WHERE cast(entrada  as datetime) BETWEEN '".$from."' AND '".$to."' GROUP BY idCochera");

        }
        elseif ($from != null) 
            $consulta = $objDB->RetornarConsulta("SELECT idCochera FROM operaciones WHERE entrada LIKE '%".$from."%'  GROUP BY idCochera");
        else
            $consulta = $objDB->RetornarConsulta("SELECT idCochera FROM operaciones GROUP BY idCochera");
        $consulta->execute();
        $usados= $consulta->fetchAll(PDO::FETCH_COLUMN,0);
        $pisos = Piso::BuscarPiso();
        $lugares = array();
        foreach($pisos as $piso)
        {
            $lugares =array_merge($lugares,range(($piso->idPiso*100),($piso->idPiso*100)+$piso->cantidadCocheras));
        }
        $lugares = array_diff($lugares,$usados);
        sort($lugares,SORT_NUMERIC);
        return $lugares;
    }
    private static function checkDateOrDateTime($var){
    if(preg_match('/\d{4}-\d{2}-\d{2}$/',$var))
        return 1;   
    elseif(preg_match('/\d{4}-\d{2}-\d{2}\h\d{2}:\d{2}:\d{2}$/',$var))
        return 0;   
    
}

}

?>