<?php
    require_once "./Entidades/AccesoDatos.php";
    class Usuario
    {
        public $id;
        public $mail;
        public $nombre;
        public $apellido;
        public $password;
        public $estado;
        public $turno;
        public $admin;
        public $entrada;
        public $pathFoto;
        public $salida;
        public function __construct($mail=NULL,$nombre=NULL,$apellido=NULL,$password=NULL,$estado=NULL,$turno=NULL,$admin=NULL,$pathFoto=NULL,$id=NULL,$entrada=NULL,$salida=NULL){
            if($mail !== NULL && $nombre !==NULL && $apellido !==NULL && $password !==NULL && $admin !==NULL && $estado !==NULL){
                $this->nombre = $nombre;
                $this->apellido = $apellido;
                $this->password = $password;
                $this->id = $id;
                $this->mail = $mail;
                $this->estado = $estado;
                $this->turno = $turno;
                $this->admin = $admin;
                $this->entrada = $entrada;
                $this->salida = $salida;
                $this->pathFoto = $pathFoto;
             }
        }
        /*
        *   Guarda los datos del usuario en la base de datos.
        *
        *
        */
        function CrearUsuario(){
            if (count(self::BuscarUsuarioPorMail($this->mail))==0)
            {
                $objDB = AccesoDatos::DameUnObjetoAcceso();
		        $consulta = $objDB->RetornarConsulta("INSERT INTO `usuarios`(`mail`,`nombre`, `apellido`,`password`, `estado`, `turno`,`admin`,`pathFoto`) VALUES (:Mail, :Nombre, :Apellido, :Password, :Estado, :Turno, :Admin,:pathFoto)");
		        $consulta->bindValue(':Nombre',$this->nombre, PDO::PARAM_STR);
                $consulta->bindValue(':Apellido',$this->apellido, PDO::PARAM_STR);
                $consulta->bindValue(':Password',$this->password, PDO::PARAM_STR);
                $consulta->bindValue(':Mail',$this->mail, PDO::PARAM_STR);
                $consulta->bindValue(':Turno',$this->turno, PDO::PARAM_STR);
                $consulta->bindValue(':Estado',$this->estado, PDO::PARAM_STR);
                $consulta->bindValue(':Admin',$this->admin, PDO::PARAM_STR);
                 $consulta->bindValue(':pathFoto',$this->pathFoto, PDO::PARAM_STR);
                return $consulta->execute();  
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
            if (count(self::BuscarUsuarioPorId($id)) != 0)
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
                if(preg_match('/\d{4}-\d{2}-\d{2}$/',$from) && preg_match('/\d{4}-\d{2}-\d{2}$/',$to))
                {
                    if($userId == 0)
                        $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id AND cast(log.entrada as date) BETWEEN   '".$from."'  AND  '".$to."'");
                    else
                    {
                        $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id AND usuarios.id=:Id AND cast(log.entrada as date) BETWEEN   '".$from."'  AND  '".$to."' ");
                        $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
                    }
                }
                else
                {
                    if($userId == 0)
                        $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id AND cast(log.entrada as datetime) BETWEEN   '".$from."'  AND  '".$to."'");
                    else
                    {
                        $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id AND usuarios.id=:Id AND cast(log.entrada as datetime) BETWEEN   '".$from."'  AND  '".$to."' ");
                        $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
                    }
                }
                //$consulta->bindValue(':from',$from, PDO::PARAM_STR);
                //$consulta->bindValue(':to',$to, PDO::PARAM_STR);
            }
            elseif($from !=null)
            {
                if($userId == 0)
                {
                    $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id AND log.entrada LIKE '%".$from."%'");
                    $consulta->bindValue(':dFrom',$from, PDO::PARAM_STR);
                }
                else
                {
                    $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id AND usuarios.id=:Id AND log.entrada LIKE '%".$from."%'");
                    $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);
                    $consulta->bindValue(':dFrom',$from, PDO::PARAM_STR);
                }
            }
            elseif($userId!=0)
            {
                $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id AND usuarios.id=:Id");
                $consulta->bindValue(':Id',$userId, PDO::PARAM_INT);

            }
            else
                $consulta = $objDB->RetornarConsulta("SELECT usuarios.id,nombre,apellido,estado,admin,turno,log.entrada,log.salida FROM usuarios, logusuarios AS log WHERE log.idUsuario=usuarios.id  ORDER BY usuarios.id");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_OBJ);
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
		    $consulta = $objDB->RetornarConsulta("SELECT id,mail,nombre,apellido,estado,turno,admin,pathFoto FROM usuarios");
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_OBJ);
        }
        /*
        *   Busca un usuario por su id en la db.
        *   return usuario si lo encuentra, false si no lo hace.
        *
        */
        static function BuscarUsuarioPorId($id)
        {
            $objDB = AccesoDatos::DameUnObjetoAcceso();
		    $consulta = $objDB->RetornarConsulta("SELECT mail,nombre,apellido,password,estado,turno,admin,id,pathFoto FROM usuarios WHERE id = :Id ");
		    $consulta->bindValue(':Id',$id, PDO::PARAM_INT);
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_CLASS,"usuario");
        }
        static function BuscarUsuarioPorMail($mail){
            $objDB = AccesoDatos::DameUnObjetoAcceso();
		    $consulta = $objDB->RetornarConsulta("SELECT mail,nombre,apellido,password,estado,turno,admin,id,pathFoto FROM usuarios WHERE mail=:Mail");
		    $consulta->bindValue(':Mail',$mail, PDO::PARAM_STR);
            $consulta->execute();
            return $consulta->fetchAll(PDO::FETCH_CLASS,"usuario");
        }
    
        /*
        *   Realiza login de usuario, registra movimiento en base de datos.
        *   return usuario si inicio correctamente, false si no lo hizo.
        *
        */
        static function LoginUsuario($mail,$password)
        {
            date_default_timezone_set('America/Argentina/Buenos_Aires');

            $date=date('Y-m-d H:i');
            $user = self::BuscarUsuarioPorMail($mail);
            if($user == false)
                return false;
            else
                $user = $user[0];
            if($user->password != $password || (!$user->estado && !$user->admin))
            {
                return false;
            }
            $objDB = AccesoDatos::DameUnObjetoAcceso();
            $consulta = $objDB->RetornarConsulta("INSERT INTO `logusuarios` (`idUsuario`,`entrada`) VALUES (:Id,STR_TO_DATE('".$date."',GET_FORMAT(DATETIME,'ISO')))");
            $consulta->bindValue(':Id',$user->id, PDO::PARAM_INT);
            $consulta->execute();
            return array('mail'=>$user->mail,'nombre'=>$user->nombre,'apellido'=>$user->apellido,'id'=>$user->id,'admin'=>$user->admin,'estado'=>$user->estado,'pathFoto'=>$user->pathFoto);
        }
        /*
        *   Realiza logout de usuario a partir de su id y registra movimiento en base de datos.
        *
        *   return false si no encuentra el usuario o hay error, true si cerro correctamente la sesion
        */
        static function LogOutUsuario($id)
        {
            date_default_timezone_set('America/Argentina/Buenos_Aires');
            $date=date('Y-m-d H:i');
            if(isset(self::BuscarUsuarioPorId($id)[0])){
                $user = self::BuscarUsuarioPorId($id)[0];
                $objDB = AccesoDatos::DameUnObjetoAcceso();
                $consulta = $objDB->RetornarConsulta("UPDATE `logusuarios` SET `salida`= STR_TO_DATE('".$date."',GET_FORMAT(DATETIME,'ISO')) WHERE  salida is NULL AND idUsuario = :Id");
                $consulta->bindValue(':Id',$user->id, PDO::PARAM_INT);
                return $consulta->execute();

            }
            return false;
            
        }
         function ModificarUsuario(){
            $objDB = AccesoDatos::DameUnObjetoAcceso();

            $consulta = $objDB->RetornarConsulta("UPDATE `usuarios` SET `mail`=:Mail,`nombre`=:Nombre, `apellido`=:Apellido,`password`=:Password, `turno`=:Turno,`admin`=:Admin,`estado`=:Estado,`pathFoto`=:pathFoto WHERE id=:Id");
            $consulta->bindValue(':Id',$this->id, PDO::PARAM_INT);
            $consulta->bindValue(':Nombre',$this->nombre, PDO::PARAM_STR);
            $consulta->bindValue(':Apellido',$this->apellido, PDO::PARAM_STR);
            $consulta->bindValue(':Password',$this->password, PDO::PARAM_STR);
            $consulta->bindValue(':Mail',$this->mail, PDO::PARAM_STR);
            $consulta->bindValue(':Estado',$this->estado, PDO::PARAM_STR);
            $consulta->bindValue(':Admin',$this->admin, PDO::PARAM_STR);
                        $consulta->bindValue(':Turno',$this->turno, PDO::PARAM_STR);
            $consulta->bindValue(':pathFoto',$this->pathFoto, PDO::PARAM_STR);
            return $consulta->execute();
        }

    }


?>