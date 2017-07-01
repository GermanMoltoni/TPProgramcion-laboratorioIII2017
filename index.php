<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
require "./EntidadesApi/UserApi.php";
require "./EntidadesApi/ParkingApi.php";
require "./EntidadesApi/OperationApi.php";
require "./EntidadesApi/Auth.php";
require "./EntidadesApi/Imagen.php";
$config['displayErrorDetails'] = true;
 
require './vendor/autoload.php';

    
$app = new \Slim\App(["settings" => $config]);
$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
            ->withHeader('Access-Control-Allow-Origin', 'http://germanmoltoni.esy.es')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});


$app->group('/usuario', function () {
    $this->get('/listar',\UserApi::class . ':ListUsersApi');
 
    $this->get('/listarLogs', \UserApi::class .':ListUsersLogApi');

    $this->delete('/baja', \UserApi::class .':DownUserApi')->add(\AuthUser::class.':verificarUsuario');

    $this->put('/suspender', \UserApi::class .':SuspenderUserApi')->add(\AuthUser::class.':verificarUsuario');

    $this->put('/habilitar', \UserApi::class .':HabilitarUserApi')->add(\AuthUser::class.':verificarUsuario');

    $this->post('/alta', \UserApi::class .':AltaUsuarioApi')
                ->add(\Imagen::class.':SubirImagenUsuario')
                ->add(\AuthUser::class.':VerificarArchivo')
                ->add(\AuthUser::class.':VerificarUsuarioDup')
                ->add(\AuthUser::class.':VerificarCamposFormUser');




})->add(\AuthUser::class.':admin');



$app->post('/login',\UserApi::class . ':LoginUserApi')->add(\AuthUser::class.':VerificarFormLogin')->add(\AuthUser::class.':login');
$app->get('/logout',\UserApi::class  .':LogoutUserApi')->add(\AuthUser::class.':users');


$app->group('/estacionamiento', function () {
    $this->post('/ingreso',\ParkingApi::class . ':ParkCarApi')->add(\AuthUser::class.':VerificarFormIngreso');
    $this->delete('/egreso/{patente}',\ParkingApi::class . ':RemoveCarApi');

    $this->get('/listaCocheras', function (Request $request, Response $response) {
        return $response->withJson(array('pisos'=>Piso::BuscarPiso(),'ocupados'=>Operacion::ListarOperacionesActivas()));




});



})->add(\AuthUser::class.':users');

$app->group('/operaciones', function () {
    $this->get('/listar',\OperationApi::class . ':ListOperationApi');
    $this->get('/cantidadoperacionesUsuarios',\OperationApi::class . ':ListOperationUserApi');

})->add(\AuthUser::class.':admin');

$app->get('/estacionamiento/listaEstadisticaCocheras', function (Request $request, Response $response) {
    return $response->withJson(Piso::EstadisticaCocheras('nunca'));
});


$app->get('/a',\ParkingApi::class.':LugarNuncaUtilizadoApi');







$app->get('/', function (Request $request, Response $response) {
     return $response->withRedirect('./index.html'); 
  
});
















$app->run();

?>


