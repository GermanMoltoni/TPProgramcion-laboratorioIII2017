<?php
    require_once "./Entidades/AccesoDatos.php";
    class Piso{
        public $idPiso;
        public $cantidadCocheras;
        public $cantidadReservados;
        public function __construct($idPiso=NULL,$cantidadCocheras=NULL,$lugarReservado=NULL){
            if($idPiso != NULL && $cantidadCocheras != NULL &&  $lugarReservado != NULL)
            {
                $this->idPiso=$idPiso;
                $this->cantidadCocheras=$cantidadCocheras;
                $this->lugarReservado=$lugarReservado;                
            }
        }
        /*
        *   Ingresa un piso en la base de datos
        *   return : true si es ingresado correctamente, false si no pudo ser cargado
        */
         function CrearPiso(){
            if(!Piso::BuscarPiso($this->numeroPiso))
            {
                
                $objDB = AccesoDatos::DameUnObjetoAcceso();
		        $consulta = $objDB->RetornarConsulta("INSERT INTO `pisos` (`idPiso`,`cantidadCocheras`,`cantidadReservados`) VALUES (:idPiso, :cantCocheras, :reservados)");
		        $consulta->bindValue(':cantCocheras',$this->cantidadCocherasEnPiso, PDO::PARAM_INT);
                $consulta->bindValue(':reservados',$this->reservados, PDO::PARAM_INT);
                $consulta->bindValue(':idPiso',$this->idPiso, PDO::PARAM_INT);
                $consulta->execute();
                return true;
            }
            return false;
        }
        /*
        *   Se obtiene un lugar de los pisos que se encuentran en la base de datos
        *   Obtiene informacion de los pisos y encuentra un lugar libre.
        *   return: id del lugar, false si no hay lugar disponible
        */
        static function ObtenerLugar(){
            $pisos = Piso::BuscarPiso();
            foreach($pisos as $piso)
            {
                $lugaresOcupados = $piso->LugaresOcupados();
                while($piso->cantidadCocheras >= count($lugaresOcupados))
                {
                    $cochera = rand(($piso->idPiso*100)+$piso->cantidadReservados,($piso->idPiso*100)+$piso->cantidadCocheras);
                    if(!in_array($cochera,$lugaresOcupados))
                        return $cochera;
                    
                }
            }
            return false;
        }
        /*
        *   Se obtiene un lugar Reservado de los pisos que se encuentran en la base de datos.
        *   Obtiene informacion de los pisos y encuentra un lugar reservado libre.
        *   return: id del lugar, false si no hay lugar disponible
        */
        static function ObtenerLugarEspecial(){
            $pisos = Piso::BuscarPiso();
            foreach($pisos as $piso)
            {
                $lugaresOcupados = $piso->LugaresReservadosOcupados();
                while($piso->cantidadReservados >= count($lugaresOcupados))
                {
                    $cochera = rand(($piso->idPiso*100),($piso->idPiso*100)+$piso->cantidadReservados);
                    if(!in_array($cochera,$lugaresOcupados))
                        return $cochera;
                }
            }
                return false;
            }
        /*
        *   Se obtiene un array de lugares ocupados del piso
        *
        *
        */
        function LugaresOcupados(){

            $objDB = AccesoDatos::DameUnObjetoAcceso();
            $idPiso = '%'.$this->idPiso.'_%_%';
            $consulta = $objDB->RetornarConsulta("SELECT `idCochera` FROM `operaciones` WHERE salida is NULL AND idCochera LIKE '$idPiso'");
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_COLUMN,0);
        }
        /*
        *   Se obtiene un array de lugares reservados ocupados del piso
        *
        *
        */
        function LugaresReservadosOcupados(){

            $objDB = AccesoDatos::DameUnObjetoAcceso();
            $idPiso = '%'.$this->idPiso.'_%_%';
            $consulta = $objDB->RetornarConsulta("SELECT `idCochera` FROM `operaciones`,`autos` WHERE salida is NULL AND idCochera LIKE '$idPiso' AND operaciones.patente = autos.patente AND autos.especial = true");
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_COLUMN,0);
        }
        
        /*
        *   Busca Pisos dentro de la base de datos
        *   recibe parametro opcional numero de piso
        *   retorna pisos,piso elegido o false si no se encontro un piso correcto
        */




         static function BuscarPiso($numero=NULL)
        {
            $objDB = AccesoDatos::DameUnObjetoAcceso();
            if($numero != NULL)
            {
                $consulta = $objDB->RetornarConsulta("SELECT `idPiso`,`cantidadCocheras`,`cantidadReservados` FROM pisos WHERE idPiso = :idPiso");
		        $consulta->bindValue('idPiso',$numero, PDO::PARAM_INT);
            }
            else
                $consulta = $objDB->RetornarConsulta("SELECT `idPiso`,`cantidadCocheras`,`cantidadReservados` FROM pisos");
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_CLASS,"piso");
        }


    }



?>