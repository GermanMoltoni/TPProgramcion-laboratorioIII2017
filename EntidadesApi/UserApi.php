<?php
require_once './Entidades/Usuario.php';
require_once './Entidades/AuthJWT.php';
require './vendor/autoload.php';
require_once './Entidades/Export.php';

class UserApi extends Usuario{
   
    public static function LoginUserApi($request, $response, $args){
        $user_data = $request->getAttribute('user');
        $user = parent::LoginUsuario($user_data['mail'],$user_data['password']);
        if($user == false)
            return $response->withJson(array('error'=>'Datos incorrectos'),201);
        return $response->withJson($user);
    }

    public static function ListaUserApi($request, $response, $args){
        $export = filter_var($request->getParam('export'), FILTER_SANITIZE_STRING);
        $lista = parent::ListarUsuarios();
        if($export != null)
        {
            $file = new Export($lista,'Listado de Usuarios');
            if($export == 'excel')
                return $file->ToExcel();
            elseif($export == 'pdf')
                return $file->ToPDF();
        }
                    
        return $response->withJson($lista);
    }

    public static function LogoutUserApi($request, $response, $args){

        $id = filter_var($request->getAttribute('idUser'), FILTER_SANITIZE_STRING);
        return $response->withJson(parent::LogoutUsuario($id));
    }
    public static function ListaLogUserApi($request, $response, $args){
            $datos = $request->getAttribute('datos');
            $export = filter_var($request->getParam('export'), FILTER_SANITIZE_STRING);
            $lista = Usuario::ListarLogsUsuario($datos['id'],$datos['from'],$datos['to']);
            if($export != null)
            {
                $file = new Export($lista,'Listado de logs');
                if($export == 'excel')
                    return $file->ToExcel();
                elseif($export == 'pdf')
                    return $file->ToPDF();
            }
            return $response->withJson($lista);
    }
    public static function BajaUserApi($request, $response, $args){
        $id = $request->getAttribute('id');
        $idAdm = $request->getAttribute('idAdm');
        if($id == $idAdm)
            return $response->withJson(array('error'=>'No se puede eliminar usuario propio'),201);
        if(Usuario::BorrarUsuario($id))
            return $response->withJson(array('msg'=>'Usuario Borrado Correctamente'),200);
        else
            return $response->withJson(array('error'=>'No se pudo borrar el usuario'),201);
    }

    public static function SuspenderUserApi($request, $response, $args) {
            $id = $request->getAttribute('id'); 
            $id = filter_var($id, FILTER_SANITIZE_STRING);
            if(Usuario::ModificarEstadoUsuario($id,0))
                return $response->withJson(array('msg'=>'Usuario Suspendido'),200);
            else
                return $response->withJson(array('error'=>'No se pudo Suspender el usuario'),201);
    }

    
    
    public static function HabilitarUserApi($request, $response, $args) {
            $id = $request->getAttribute('id'); 
            $id = filter_var($id, FILTER_SANITIZE_STRING);
            if(Usuario::ModificarEstadoUsuario($id,1))
                return $response->withJson(array('msg'=>'Usuario Habilitado'),200);
            else
                return $response->withJson(array('error'=>'No se pudo Habilitar el usuario'),201);
    }

    public static function AltaUsuarioApi($request, $response, $args) {
        $user_data = $request->getAttribute('user');
        $path = $request->getAttribute('pathFoto');
        $user = new Usuario($user_data['mail'],$user_data['nombre'],$user_data['apellido'],$user_data['password'],$user_data['estado'],$user_data['turno'],$user_data['admin'],$path);
        $user->CrearUsuario();
        $user = Usuario::BuscarUsuarioPorMail($user_data['mail']);
        if(count($user) != 0)
        {
            $user=$user[0];
            return $response->withJson(array('mail'=>$user->mail,'nombre'=>$user->nombre,'apellido'=>$user->apellido,'id'=>$user->id,'admin'=>$user->admin,'estado'=>$user->estado,'turno'=>$user->turno,'pathFoto'=>$user->pathFoto));
        }
        return $response->withJson(array('error'=>'No se pudo crear el usuario'),201);
        
    }
    public static function ModificarUsuarioApi($request, $response, $args){
        $user_data = $request->getAttribute('user');
        $id = $request->getAttribute('id');
        $path = $request->getAttribute('pathFoto');
        $user = new Usuario($user_data['mail'],$user_data['nombre'],$user_data['apellido'],$user_data['password'],$user_data['estado'],$user_data['turno'],$user_data['admin'],$path,$id);
        if($user->ModificarUsuario())
            return $response->withJson(array('error'=>'Modificado Correctamente'),200);
        return $response->withJson(array('error'=>'No se pudo modificar el usuario'),201);

        
    }
    


}


?>