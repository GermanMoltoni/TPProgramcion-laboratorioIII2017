<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
require "./EntidadesApi/UserApi.php";
require "./EntidadesApi/ParkingApi.php";
require "./EntidadesApi/OperationApi.php";
require "./EntidadesApi/Auth.php";
require "./EntidadesApi/Imagen.php";
require "./EntidadesApi/EstadisticaApi.php";
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
    $this->get('/listar',\UserApi::class . ':ListaUserApi');
 
    $this->get('/listarLogs', \UserApi::class .':ListaLogUserApi')
                ->add(\AuthUser::class.':verificarFormTiempo');

    $this->delete('/baja', \UserApi::class .':BajaUserApi')
                ->add(\AuthUser::class.':verificarUsuario');

    $this->put('/suspender', \UserApi::class .':SuspenderUserApi')
                ->add(\AuthUser::class.':verificarUsuario');

    $this->put('/habilitar', \UserApi::class .':HabilitarUserApi')
                ->add(\AuthUser::class.':verificarUsuario');

    $this->post('/alta', \UserApi::class .':AltaUsuarioApi')
                ->add(\Imagen::class.':SubirImagenUsuario')
                ->add(\AuthUser::class.':VerificarArchivo')
                ->add(\AuthUser::class.':VerificarUsuarioDup')
                ->add(\AuthUser::class.':VerificarCamposFormUser');
    $this->post('/modificar', \UserApi::class .':ModificarUsuarioApi')
                ->add(\Imagen::class.':ModificarImagenUsuario')
                ->add(\AuthUser::class.':VerificarArchivo')
                ->add(\AuthUser::class.':verificarModificacionUsuario')
                ->add(\AuthUser::class.':VerificarUsuario')
                ->add(\AuthUser::class.':VerificarModifFormUser');

})->add(\AuthUser::class.':admin');



$app->post('/login',\UserApi::class . ':LoginUserApi')
                ->add(\AuthUser::class.':VerificarFormLogin')
                ->add(\AuthUser::class.':login');
$app->get('/logout',\UserApi::class  .':LogoutUserApi')
                ->add(\AuthUser::class.':users');


$app->group('/estacionamiento', function () {
    $this->post('/ingreso',\ParkingApi::class . ':ParkCarApi')
                    ->add(\AuthUser::class.':VerificarFormIngreso');
    $this->delete('/egreso/{patente}',\ParkingApi::class . ':RemoveCarApi');
    $this->get('/listaCocheras', function (Request $request, Response $response) {
        return $response->withJson(array('pisos'=>Piso::BuscarPiso(),'ocupados'=>Operacion::ListarOperacionesActivas()));
});




        $this->group('/lugares', function () {
            $this->get('/menosUtilizado',\ParkingApi::class.':LugarMenosUtilizadoApi');

$this->get('/nuncaUtilizado',\ParkingApi::class.':LugarNuncaUtilizadoApi');


$this->get('/masUtilizado',\ParkingApi::class.':LugarMasUtilizadoApi');
                

})->add(\AuthUser::class.':verificarFormTiempo');




})->add(\AuthUser::class.':users');

$app->group('/operaciones', function () {
    $this->get('/listar',\OperationApi::class . ':ListOperationApi')
                ->add(\AuthUser::class.':verificarFormTiempo');
    $this->get('/operacionesUsuarios',\OperationApi::class . ':ListOperationUserApi')
                ->add(\AuthUser::class.':verificarFormTiempo');
    
})->add(\AuthUser::class.':admin');

$app->group('/estadistica', function () {
        $this->get('/facturacion',\EstadisticaApi::class . ':FacturacionApi')
                ->add(\AuthUser::class.':verificarFechas');
        $this->get('/usococheras',\EstadisticaApi::class . ':UsoCocherasApi')
                ->add(\AuthUser::class.':verificarFechas');
        $this->get('/vehiculos',\EstadisticaApi::class . ':ListadoVehiculosEstApi')
                ->add(\AuthUser::class.':verificarFechas');   



        $this->get('/promediofacturacionmensual',\EstadisticaApi::class . ':PromedioFacMensualApi')
                ->add(\AuthUser::class.':verificarPromedioTiempo');
        $this->get('/promedioautosmensual',\EstadisticaApi::class . ':PromedioAutosMensualApi')
                ->add(\AuthUser::class.':verificarPromedioTiempo');
        $this->get('/promediousuariomensual',\EstadisticaApi::class . ':PromedioUsuarioMensualApi')
                ->add(\AuthUser::class.':verificarPromedioTiempo');




                
    })->add(\AuthUser::class.':admin');
$app->get('/', function (Request $request, Response $response) {
     return $response->withRedirect('./index.html'); 
  
});

 


$app->run();

?>


