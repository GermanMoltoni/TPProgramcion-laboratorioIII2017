<?php
require_once './vendor/autoload.php';
use Firebase\JWT\JWT;
class AuthJWT{
    private static $secretKey = '1.2/3;4#3@123$';
    private static $encrypt = ['HS256'];
    private static $aud = null;

    public static function CrearToken($datos)
    {
        $time=time();
        $payload = array(
            'iat'=> $time,
            'exp'=> $time+(600*60),
            'data'=> $datos,
            'aud'=>self::Aud(),
            'app'=>"Api Rest JWT"
        );
        return JWT::encode($payload,self::$secretKey);
    }
    public static function CheckToken($token){
        if(empty($token))
            throw new Exception("Invalid token supplied.");
        $decode = JWT::decode($token,self::$secretKey,self::$encrypt);            
        if($decode->aud !== self::Aud())
            throw new Exception("Invalid user logged in.");
    }
     public static function GetData($token)
    {
        return JWT::decode($token,self::$secretKey,self::$encrypt)->data;
    }
    private static function Aud()
    {
        $aud = '';
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $aud = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $aud = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $aud = $_SERVER['REMOTE_ADDR'];
        }
        $aud .= @$_SERVER['HTTP_USER_AGENT'];
        $aud .= gethostname();
        
        return sha1($aud);
    }
}
?>