<?php
    require_once "./Entidades/AccesoDatos.php";
    class Usuario
    {
        public $id;
        public $nombre;
        public $apellido;
        public $password;
        public $estado;
        public $turno;
        public $admin;
        public $entrada;
        public $salida;
        public function __construct($id=NULL,$nombre=NULL,$apellido=NULL,$password=NULL,$estado=NULL,$turno=NULL,$admin=NULL,$entrada=NULL,$salida=NULL){
            if($id !== NULL && $nombre !==NULL && $apellido !==NULL && $password !==NULL && $admin !==NULL && $estado !==NULL){
                $this->nombre = $nombre;
                $this->apellido = $apellido;
                $this->password = $password;
                $this->id = $id;
                $this->estado = $estado;
                $this->turno = $turno;
                $this->admin = $admin;
                $this->entrada = $entrada;
                $this->salida = $salida;
             }
        }
        /*
        *   Guarda los datos del usuario en la base de datos.
        *
        *
        */
        function CrearUsuario(){
            if(!Usuario::BuscarUsuario($this->id))
            {
                $objDB = AccesoDatos::DameUnObjetoAcceso();
		        $consulta = $objDB->RetornarConsulta("INSERT INTO `usuarios`(`id`,`nombre`, `apellido`,`password`, `estado`, `turno`,`admin`) VALUES (:Id, :Nombre, :Apellido, :Password, :Estado, :Turno, :Admin)");
		        $consulta->bindValue(':Nombre',$this->nombre, PDO::PARAM_STR);
                $consulta->bindValue(':Apellido',$this->apellido, PDO::PARAM_STR);
                $consulta->bindValue(':Password',$this->password, PDO::PARAM_STR);
                $consulta->bindValue(':Id',$this->id, PDO::PARAM_INT);
                $consulta->bindValue(':Turno',$this->turno, PDO::PARAM_STR);
                $consulta->bindValue(':Estado',$this->estado, PDO::PARAM_STR);
                $consulta->bindValue(':Admin',$this->admin, PDO::PARAM_STR);
                $consulta->execute();
                return true;
            }
            return false;
        }
        /*
        *   modifica el estado del usuario, habilitado o suspendido.
        *   return true si lo logra. false si no lo  encuentra o no se realiza la accion
        *
        */
        static function ModificarEstadoUsuario($id,$estado)
        {
            if (Usuario::BuscarUsuario($id) != false)
            {
                $objDB = AccesoDatos::DameUnObjetoAcceso(); 
                $consulta = $objDB->RetornarConsulta("UPDATE `usuarios` SET `estado` = :estado WHERE `id` = :Id");
		        $consulta->bindValue(':Id',$id, PDO::PARAM_INT);
                $consulta->bindValue(':estado',$estado, PDO::PARAM_STR);
                $consulta->execute();
                return true;
            }
            return false;
        }
        static function ListarLogsUsuario($userId=0,$from=null,$to=null){
            $objDB = AccesoDatos::DameUnObjetoAcceso();
            if($from !=null && $to != null)
            {
                if($userId == 0)
                    $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,' ' as password,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id AND log.entrada BETWEEN  '".$from."'  AND '".$to."'");
		        else
                {
                    $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,' ' as password,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id AND usuarios.id=:Id AND log.entrada BETWEEN  '".$from."'  AND '".$to."'");
                    $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
                }
                //$consulta->bindValue(':from',$from, PDO::PARAM_STR);
                //$consulta->bindValue(':to',$to, PDO::PARAM_STR);
            }
            elseif($from !=null)
            {
                if($userId == 0)
                {
                    $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,' ' as password,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id AND log.entrada LIKE '%".$from."%'");
                    $consulta->bindValue(':dFrom',$from, PDO::PARAM_STR);
                }
                else
                {
                    $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,' ' as password,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id AND usuarios.id=:Id AND log.entrada LIKE '%".$from."%'");
                    $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
                    $consulta->bindValue(':dFrom',$from, PDO::PARAM_STR);
                }
            }
            elseif($userId!=0)
            {
                $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,' ' as password,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id AND usuarios.id=:Id");
                $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);

            }
            else
                $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,' ' as password,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id  ORDER BY usuarios.id");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_CLASS,"usuario");
        }
        /*
        *   Borra un usuario por su id.
        *   return true si lo logra, false si no lo hace
        *
        */
        static function BorrarUsuario($id)
        {
            $objDB = AccesoDatos::DameUnObjetoAcceso();
		    $consulta = $objDB->RetornarConsulta("DELETE FROM usuarios WHERE id = :Id");
		    $consulta->bindValue(':Id',$id, PDO::PARAM_INT);
            return $consulta->execute();
        }
        /*
        *   Lista los usuarios.
        *
        *
        */
        static function ListarUsuarios(){
            $objDB = AccesoDatos::DameUnObjetoAcceso();
		    $consulta = $objDB->RetornarConsulta("SELECT id,nombre,apellido,' ' as password,estado,turno,admin FROM usuarios");
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_CLASS,"usuario");
        }
        /*
        *   Busca un usuario por su id en la db.
        *   return usuario si lo encuentra, false si no lo hace.
        *
        */
        static function BuscarUsuario($id)
        {
            $objDB = AccesoDatos::DameUnObjetoAcceso();
		    $consulta = $objDB->RetornarConsulta("SELECT id,nombre,apellido,password,estado,turno,admin FROM usuarios WHERE id = :Id");
		    $consulta->bindValue(':Id',$id, PDO::PARAM_INT);
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_CLASS,"usuario");
        }
        /*
        *   Realiza login de usuario, registra movimiento en base de datos.
        *   return usuario si inicio correctamente, false si no lo hizo.
        *
        */
        static function LoginUsuario($id,$password)
        {
            $user = Usuario::BuscarUsuario($id);
            if($user == false)
                return false;
            else
                $user = $user[0];
            if($user->password != $password || (!$user->estado && !$user->admin))
            {
                return false;
            }
            $objDB = AccesoDatos::DameUnObjetoAcceso();
            $consulta = $objDB->RetornarConsulta("INSERT INTO `logusuarios` (`idUsuario`,`entrada`) VALUES (:Id,NOW())");
            $consulta->bindValue(':Id',$user->id, PDO::PARAM_INT);
            $consulta->execute();
            return array('nombre'=>$user->nombre,'apellido'=>$user->apellido,'id'=>$user->id,'admin'=>$user->admin,'estado'=>$user->estado);
        }
        /*
        *   Realiza logout de usuario a partir de su id y registra movimiento en base de datos.
        *
        *   return false si no encuentra el usuario o hay error, true si cerro correctamente la sesion
        */
        static function LogOutUsuario($id)
        {
            $user = Usuario::BuscarUsuario($id)[0];
            if($user != false){
                $objDB = AccesoDatos::DameUnObjetoAcceso();
                $consulta = $objDB->RetornarConsulta("UPDATE `logusuarios` SET `salida`= NOW() WHERE  salida is NULL AND idUsuario = :Id");
                $consulta->bindValue(':Id',$user->id, PDO::PARAM_INT);
                return $consulta->execute();

            }
            return false;
            
        }



    }


?>